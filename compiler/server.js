const express = require('express');
const { exec } = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post('/compile', async (req, res) => {
  const { files, mainFile } = req.body;

  if (!files || !Array.isArray(files) || !mainFile) {
    return res.status(400).send('Invalid payload');
  }

  let tmpDir;
  try {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'texforge-'));
    
    // Write all files to temp directory
    for (const file of files) {
      if (file.name && file.content) {
        await fs.writeFile(path.join(tmpDir, file.name), file.content);
      }
    }

    // Run tectonic compilation
    // tectonic automatically downloads packages on the fly and does not require multiple passes
    exec(`tectonic "${mainFile}"`, { cwd: tmpDir }, async (error, stdout, stderr) => {
      if (error) {
        console.error('Compilation Error:', stderr || stdout);
        return res.status(500).send(stderr || stdout || error.message);
      }

      const pdfFileName = mainFile.replace(/\.tex$/, '.pdf');
      const pdfPath = path.join(tmpDir, pdfFileName);

      try {
        const pdfBuffer = await fs.readFile(pdfPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdfFileName}"`);
        res.send(pdfBuffer);
      } catch (readErr) {
        console.error('Failed to read PDF:', readErr);
        res.status(500).send('Failed to read generated PDF');
      } finally {
        // Cleanup temp directory
        try {
          await fs.rm(tmpDir, { recursive: true, force: true });
        } catch (cleanupErr) {
          console.error('Failed to cleanup temp dir:', cleanupErr);
        }
      }
    });

  } catch (err) {
    console.error('Server error:', err);
    if (tmpDir) {
      fs.rm(tmpDir, { recursive: true, force: true }).catch(console.error);
    }
    res.status(500).send('Internal Server Error');
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Compiler service listening on port ${PORT}`);
});

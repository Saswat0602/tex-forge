# TexForge

TexForge is a web app that lets you write and compile LaTeX documents right in your browser. 

Think of it as a simpler, self-hosted alternative to Overleaf. You don't need to install massive LaTeX distributions like TeX Live on your computer. You just open your browser, type your code, and hit compile. 

## How it works

1. **Browser-based Editor**: You write your document in a clean code editor.
2. **Background Compiler**: A local Docker container running [Tectonic](https://tectonic-typesetting.github.io/) takes your code and compiles it into a PDF in the background. Tectonic automatically downloads only the packages your document needs.
3. **Live Preview**: The generated PDF is streamed directly back to your screen.
4. **Cloud Storage**: Your documents and PDFs are saved to a MongoDB database so you don't lose your work.

## Setup Instructions

### 1. Start the Compiler
You need Docker installed to run the background LaTeX compiler. Open your terminal and run:

```bash
docker-compose up -d
```
*Note: The first time you compile a new document, it might take a moment to download the required LaTeX packages. We use a persistent Docker volume so it only ever downloads a package once!*

### 2. Setup the Web App
Copy the `.env.example` file to a new file called `.env` and fill in your MongoDB and Google/GitHub authentication keys.

### 3. Run it
Install the required Node packages and start the Next.js development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser, log in, and start writing!

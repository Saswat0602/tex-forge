"use client";

import { useEditorStore } from "@/stores/editorStore";
import { Play, Loader2, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure pdf.js worker using unpkg (works flawlessly with Next.js Turbopack)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfPreview() {
  const { isCompiling, setIsCompiling, projectId, isSaving, title } = useEditorStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);

  const handleCompile = async () => {
    if (!projectId) return;
    
    setIsCompiling(true);
    setErrorLog(null);
    
    try {
      // The API route compiles and streams the PDF directly
      const res = await fetch(`/api/compile?projectId=${projectId}`);
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorLog(err.message);
      } else {
        setErrorLog("Failed to compile document.");
      }
    } finally {
      setIsCompiling(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex-1 border-l bg-muted/10 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b bg-card flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          PDF Preview
          {isSaving && <span className="text-xs text-muted-foreground font-normal">(Saving...)</span>}
        </h2>
        
        <div className="flex items-center gap-2">
          {pdfUrl && (
            <div className="flex items-center bg-muted rounded border overflow-hidden mr-2">
              <button 
                onClick={() => setScale(s => Math.max(0.5, s - 0.2))} 
                className="p-1.5 hover:bg-muted-foreground/10 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs px-2 font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
              <button 
                onClick={() => setScale(s => Math.min(3, s + 0.2))} 
                className="p-1.5 hover:bg-muted-foreground/10 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {pdfUrl && (
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = pdfUrl;
                a.download = `${title || "document"}.pdf`;
                a.click();
              }}
              className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors mr-2 border border-transparent hover:border-border"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={handleCompile}
            disabled={isCompiling || isSaving}
            className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isCompiling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Compile
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-[#525659] flex justify-center p-4">
        {errorLog ? (
          <div className="bg-background text-red-500 font-mono text-sm p-4 rounded shadow-lg max-w-2xl w-full whitespace-pre-wrap overflow-auto self-start border border-red-500/20">
            <h3 className="text-red-500 font-bold mb-2">Compilation Error</h3>
            {errorLog}
          </div>
        ) : pdfUrl ? (
          <div className="shadow-2xl">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center p-12 text-muted-foreground bg-card">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading PDF viewer...
                </div>
              }
              error={
                <div className="p-4 text-red-500 bg-background rounded shadow">Failed to load PDF.</div>
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="mb-4">
                  <Page
                    pageNumber={index + 1}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-md"
                  />
                </div>
              ))}
            </Document>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-center text-muted-foreground flex-col gap-4 self-center h-full">
            <div className="p-4 bg-muted/20 rounded-full">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">No PDF Generated</p>
              <p className="text-sm">Click the Compile button to build your LaTeX document.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

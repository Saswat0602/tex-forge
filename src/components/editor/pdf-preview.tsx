"use client";

import { useEditorStore } from "@/stores/editorStore";
import { Play } from "lucide-react";

export function PdfPreview() {
  const { isCompiling, setIsCompiling } = useEditorStore();

  const handleCompile = () => {
    setIsCompiling(true);
    // Placeholder for actual compile logic in Phase 5
    setTimeout(() => {
      setIsCompiling(false);
    }, 2000);
  };

  return (
    <div className="flex-1 border-l bg-muted/10 flex flex-col h-full">
      <div className="p-3 border-b bg-card flex items-center justify-between">
        <h2 className="text-sm font-semibold">PDF Preview</h2>
        <button
          onClick={handleCompile}
          disabled={isCompiling}
          className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          {isCompiling ? "Compiling..." : "Compile"}
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground flex-col gap-4">
        <div className="p-4 bg-muted rounded-full">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-foreground mb-1">No PDF Generated</p>
          <p className="text-sm">Click the Compile button to build your LaTeX document.</p>
        </div>
      </div>
    </div>
  );
}

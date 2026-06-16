"use client";

import { useEditorStore } from "@/stores/editorStore";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

export function CodeEditor() {
  const { getActiveFile, updateFileContent } = useEditorStore();
  const activeFile = getActiveFile();
  const { resolvedTheme } = useTheme();
  const monaco = useMonaco();
  const editorRef = useRef<unknown>(null);

  // Set up custom Monaco theme based on next-themes
  useEffect(() => {
    if (monaco) {
      // Register basic LaTeX syntax highlighting if not present
      if (!monaco.languages.getLanguages().some((l) => l.id === "latex")) {
        monaco.languages.register({ id: "latex" });
        monaco.languages.setMonarchTokensProvider("latex", {
          tokenizer: {
            root: [
              [/\\[a-zA-Z@]+/, "keyword"],
              [/[\{\}\[\]]/, "delimiter"],
              [/\$.*?\$/, "string"], // math mode
              [/[%].*$/, "comment"], // comments
            ],
          },
        });
      }

      monaco.editor.defineTheme("texforge-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "c678dd" }, // Purple for macros
          { token: "delimiter", foreground: "abb2bf" }, // Gray for brackets
          { token: "string", foreground: "98c379" }, // Green for math
          { token: "comment", foreground: "5c6370", fontStyle: "italic" }, // Gray for comments
        ],
        colors: {
          "editor.background": "#09090b", // match standard shadcn background
        },
      });
      monaco.editor.setTheme(resolvedTheme === "dark" ? "texforge-dark" : "light");
    }
  }, [monaco, resolvedTheme]);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-muted-foreground">
        Select a file to edit
      </div>
    );
  }

  if (activeFile.type !== "text") {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-muted-foreground flex-col gap-2">
        <p>This file cannot be opened in the text editor.</p>
        <p className="text-sm">Type: {activeFile.type}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full w-full relative">
      <Editor
        height="100%"
        language="latex"
        theme={resolvedTheme === "dark" ? "texforge-dark" : "light"}
        value={activeFile.content}
        onChange={(value) => {
          if (value !== undefined) {
            updateFileContent(activeFile.name, value);
          }
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineHeight: 1.6,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
        }}
        loading={
          <div className="flex items-center justify-center h-full w-full text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading Editor...
          </div>
        }
      />
    </div>
  );
}

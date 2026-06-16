"use client";

import { useEffect, useRef } from "react";
import { useEditorStore, ProjectFile } from "@/stores/editorStore";
import { Sidebar } from "./sidebar";
import { CodeEditor } from "./code-editor";
import { saveProjectFiles } from "@/actions/editor.actions";
import dynamic from "next/dynamic";

const PdfPreview = dynamic(() => import("./pdf-preview").then((mod) => mod.PdfPreview), { ssr: false });

type WorkspaceProps = {
  projectId: string;
  initialTitle: string;
  initialFiles: ProjectFile[];
};

export function Workspace({ projectId, initialTitle, initialFiles }: WorkspaceProps) {
  const { setProjectData, files, isSaving, setIsSaving } = useEditorStore();
  const mounted = useRef(false);

  // Initialize store with server data
  useEffect(() => {
    setProjectData(projectId, initialTitle, initialFiles);
    mounted.current = true;
  }, [projectId, initialTitle, initialFiles, setProjectData]);

  // Debounced Auto-Save
  useEffect(() => {
    if (!mounted.current) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveProjectFiles(projectId, files);
      } catch (err) {
        console.error("Auto-save failed", err);
      } finally {
        setIsSaving(false);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [files, projectId, setIsSaving]);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* 1. Sidebar (File Explorer) */}
      <Sidebar />

      {/* 2. Code Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 border-b bg-muted/20 flex items-center px-4 justify-end">
           {isSaving ? (
             <span className="text-xs text-muted-foreground flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> Saving...
             </span>
           ) : (
             <span className="text-xs text-muted-foreground flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Saved
             </span>
           )}
        </div>
        <CodeEditor />
      </div>

      {/* 3. PDF Preview */}
      <PdfPreview />
    </div>
  );
}

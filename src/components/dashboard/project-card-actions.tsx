"use client";

import { useState } from "react";
import { Copy, Trash2, Loader2, Download, Archive, PenLine } from "lucide-react";
import { deleteProject, duplicateProject, exportProjectFiles, renameProject } from "@/actions/project.actions";
import { toast } from "sonner";
import JSZip from "jszip";

export function ProjectCardActions({ projectId, projectTitle }: { projectId: string, projectTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDuplicating(true);
    try {
      const res = await duplicateProject(projectId);
      if (res.ok) {
        toast.success("Project duplicated successfully!");
      } else {
        toast.error(res.error || "Failed to duplicate project");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleRename = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newTitle = prompt("Enter new project title:", projectTitle);
    if (!newTitle || newTitle.trim() === "" || newTitle === projectTitle) return;

    setIsRenaming(true);
    try {
      const res = await renameProject(projectId, newTitle);
      if (res.ok) {
        toast.success("Project renamed successfully!");
      } else {
        toast.error(res.error || "Failed to rename project");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDownloadSource = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const res = await exportProjectFiles(projectId);
      if (res.ok && res.data) {
        const mainFile = res.data.find((f: any) => f.name.endsWith('.tex')) || res.data[0];
        if (!mainFile) {
          toast.error("No source file found");
          return;
        }
        const blob = new Blob([mainFile.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const safeTitle = (projectTitle || "document").replace(/[^a-zA-Z0-9_-]/g, "_");
        a.download = `${safeTitle}.tex`;
        a.click();
      } else {
        toast.error(res.error || "Failed to download source");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadZip = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsZipping(true);
    try {
      const res = await exportProjectFiles(projectId);
      if (res.ok && res.data) {
        const zip = new JSZip();
        res.data.forEach((file: any) => {
          if (file.type === "image" && file.content.startsWith("data:")) {
             const base64Data = file.content.split(",")[1];
             zip.file(file.name, base64Data, { base64: true });
          } else {
             zip.file(file.name, file.content);
          }
        });
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        const safeTitle = (projectTitle || "document").replace(/[^a-zA-Z0-9_-]/g, "_");
        a.download = `${safeTitle}.zip`;
        a.click();
      } else {
        toast.error(res.error || "Failed to create ZIP");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsZipping(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteProject(projectId);
      if (res.ok) {
        toast.success("Project deleted.");
      } else {
        toast.error(res.error || "Failed to delete project");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const isWorking = isDeleting || isDuplicating || isDownloading || isZipping || isRenaming;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <button
        onClick={handleDuplicate}
        disabled={isWorking}
        title="Duplicate"
        className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
      >
        {isDuplicating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
      </button>
      <button
        onClick={handleRename}
        disabled={isWorking}
        title="Rename"
        className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
      >
        {isRenaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
      </button>
      <button
        onClick={handleDownloadSource}
        disabled={isWorking}
        title="Download Main Source"
        className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
      >
        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </button>
      <button
        onClick={handleDownloadZip}
        disabled={isWorking}
        title="Download ZIP"
        className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
      >
        {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
      </button>
      <button
        onClick={handleDelete}
        disabled={isWorking}
        title="Delete"
        className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

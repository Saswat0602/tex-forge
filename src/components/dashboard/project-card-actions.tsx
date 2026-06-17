"use client";

import { useState } from "react";
import { MoreVertical, PenLine, ExternalLink, Copy, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProject, duplicateProject, renameProject } from "@/actions/project.actions";
import { toast } from "sonner";

export function ProjectCardActions({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const router = useRouter();

  const handleDuplicate = async () => {
    setIsOpen(false);
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

  const handleRename = async () => {
    setIsOpen(false);
    const newTitle = prompt("Enter new project title:");
    if (!newTitle || newTitle.trim() === "") return;

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

  const handleDelete = async () => {
    setIsOpen(false);
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDeleting || isDuplicating || isRenaming}
        className="p-2 hover:bg-muted rounded-md transition-colors"
      >
        {isDeleting || isDuplicating || isRenaming ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MoreVertical className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground border rounded-md shadow-lg z-50 py-1.5 text-sm overflow-hidden">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/editor/${projectId}`);
              }}
              className="w-full text-left px-3 py-2 hover:bg-muted focus:bg-muted flex items-center gap-2 outline-none transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground" /> Open Editor
            </button>
            <button
              onClick={handleRename}
              className="w-full text-left px-3 py-2 hover:bg-muted focus:bg-muted flex items-center gap-2 outline-none transition-colors"
            >
              <PenLine className="w-4 h-4 text-muted-foreground" /> Rename
            </button>
            <div className="h-px bg-border my-1 mx-2" />
            <button
              onClick={handleDuplicate}
              className="w-full text-left px-3 py-2 hover:bg-muted focus:bg-muted flex items-center gap-2 outline-none transition-colors"
            >
              <Copy className="w-4 h-4 text-muted-foreground" /> Duplicate
            </button>
            <div className="h-px bg-border my-1 mx-2" />
            <button
              onClick={handleDelete}
              className="w-full text-left px-3 py-2 hover:bg-destructive/10 focus:bg-destructive/10 text-destructive flex items-center gap-2 outline-none transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

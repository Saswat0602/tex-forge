"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Copy, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProject, duplicateProject } from "@/actions/project.actions";
import { toast } from "sonner";

export function ProjectCardActions({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
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
        disabled={isDeleting || isDuplicating}
        className="p-2 hover:bg-muted rounded-md transition-colors"
      >
        {isDeleting || isDuplicating ? (
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
          <div className="absolute right-0 mt-1 w-48 bg-card border rounded-md shadow-lg z-20 py-1 text-sm overflow-hidden">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/editor/${projectId}`);
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Open Editor
            </button>
            <button
              onClick={handleDuplicate}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
            >
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 hover:bg-destructive hover:text-destructive-foreground flex items-center gap-2 text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

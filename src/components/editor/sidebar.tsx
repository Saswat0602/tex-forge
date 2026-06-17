"use client";

import { useEditorStore } from "@/stores/editorStore";
import { FileText, Image as ImageIcon, File as FileIcon, Plus, ArrowLeft, X, Edit2, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function Sidebar() {
  const { files, activeFileName, setActiveFile, title, addFile, deleteFile, renameFile } = useEditorStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingFile && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [renamingFile]);

  const handleAddFile = () => {
    if (!newFileName.trim()) {
      setIsAdding(false);
      return;
    }
    const name = newFileName.trim().includes(".") ? newFileName.trim() : `${newFileName.trim()}.tex`;
    addFile(name, name.endsWith(".tex") || name.endsWith(".bib") ? "text" : "image");
    setNewFileName("");
    setIsAdding(false);
  };

  const handleRename = (oldName: string) => {
    if (!renameValue.trim() || renameValue === oldName) {
      setRenamingFile(null);
      return;
    }
    const name = renameValue.trim().includes(".") ? renameValue.trim() : `${renameValue.trim()}.tex`;
    renameFile(oldName, name);
    setRenamingFile(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-green-500 shrink-0" />;
      default:
        return <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const type = file.type.startsWith("image/") || file.name.match(/\\.(png|jpg|jpeg)$/i) ? "image" : "text";
      addFile(file.name, type, content);
    };
    
    if (file.type.startsWith("image/") || file.name.match(/\\.(png|jpg|jpeg)$/i)) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
    
    // reset input
    e.target.value = '';
  };

  return (
    <div className="w-64 border-r bg-muted/20 flex flex-col h-full select-none">
      <div className="p-4 border-b bg-card">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Dashboard
        </Link>
        <h2 className="font-semibold truncate" title={title}>{title}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 flex flex-col">
        <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Files</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              title="Upload File"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
              accept=".tex,.bib,.png,.jpg,.jpeg,.pdf"
            />
            <button 
              onClick={() => setIsAdding(true)}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              title="New File"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <ul className="space-y-1 px-2 mb-2">
          {files.map((file) => (
            <li key={file.name} className="group relative">
              {renamingFile === file.name ? (
                <div className="flex items-center gap-2 px-2 py-1.5">
                  {getIcon(file.type)}
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRename(file.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(file.name);
                      if (e.key === "Escape") setRenamingFile(null);
                    }}
                    className="flex-1 h-6 text-sm px-1 -ml-1 rounded-sm bg-background border outline-none focus:border-primary"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setActiveFile(file.name)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeFileName === file.name
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {getIcon(file.type)}
                  <span className="truncate flex-1 text-left">{file.name}</span>
                  
                  {file.isMain ? (
                    <span className="text-[10px] uppercase tracking-wide bg-primary/20 text-primary px-1.5 py-0.5 rounded shrink-0">
                      Main
                    </span>
                  ) : (
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenameValue(file.name);
                          setRenamingFile(file.name);
                        }}
                        className="p-1 hover:bg-primary/20 hover:text-primary rounded text-muted-foreground transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete ${file.name}?`)) deleteFile(file.name);
                        }}
                        className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded text-muted-foreground transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>

        {isAdding && (
          <div className="px-3 py-1 flex items-center gap-1">
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => handleAddFile()}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddFile();
                if (e.key === "Escape") setIsAdding(false);
              }}
              placeholder="filename.tex"
              className="flex-1 h-7 text-sm px-2 rounded-md bg-background border outline-none focus:border-primary"
            />
            <button 
              onMouseDown={(e) => e.preventDefault()} // prevent blur on click
              onClick={() => setIsAdding(false)} 
              className="p-1 text-muted-foreground hover:bg-muted rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

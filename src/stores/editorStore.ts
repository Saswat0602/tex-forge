import { create } from "zustand";

export type ProjectFile = {
  name: string;
  content: string;
  type: "text" | "image" | "pdf";
  url?: string;
  isMain: boolean;
};

type EditorState = {
  projectId: string | null;
  title: string;
  files: ProjectFile[];
  activeFileName: string | null;
  isSaving: boolean;
  isCompiling: boolean;
  
  // Actions
  setProjectData: (id: string, title: string, files: ProjectFile[]) => void;
  setActiveFile: (fileName: string) => void;
  updateFileContent: (fileName: string, content: string) => void;
  addFile: (fileName: string, type: "text" | "image" | "pdf", content?: string) => void;
  deleteFile: (fileName: string) => void;
  renameFile: (oldName: string, newName: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  setIsCompiling: (isCompiling: boolean) => void;
  
  // Getters
  getActiveFile: () => ProjectFile | undefined;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  title: "Loading...",
  files: [],
  activeFileName: null,
  isSaving: false,
  isCompiling: false,

  setProjectData: (id, title, files) => {
    set({
      projectId: id,
      title,
      files,
      activeFileName: files.find((f) => f.isMain)?.name || files[0]?.name || null,
    });
  },

  setActiveFile: (fileName) => {
    set({ activeFileName: fileName });
  },

  updateFileContent: (fileName, content) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.name === fileName ? { ...file, content } : file
      ),
    }));
  },

  addFile: (fileName, type, content = "") => {
    set((state) => {
      if (state.files.some((f) => f.name === fileName)) return state; // Avoid duplicates
      
      const newFile: ProjectFile = {
        name: fileName,
        content,
        type,
        isMain: false,
      };
      
      return {
        files: [...state.files, newFile],
        activeFileName: fileName,
      };
    });
  },

  deleteFile: (fileName) => {
    set((state) => {
      const newFiles = state.files.filter((f) => f.name !== fileName);
      return {
        files: newFiles,
        activeFileName: state.activeFileName === fileName 
          ? (newFiles.find(f => f.isMain)?.name || newFiles[0]?.name || null)
          : state.activeFileName
      };
    });
  },

  renameFile: (oldName, newName) => {
    set((state) => {
      if (state.files.some((f) => f.name === newName)) return state; // Avoid duplicate names
      
      const newFiles = state.files.map((file) => 
        file.name === oldName ? { ...file, name: newName } : file
      );
      
      return {
        files: newFiles,
        activeFileName: state.activeFileName === oldName ? newName : state.activeFileName
      };
    });
  },

  setIsSaving: (isSaving) => {
    set({ isSaving });
  },

  setIsCompiling: (isCompiling) => {
    set({ isCompiling });
  },

  getActiveFile: () => {
    const { files, activeFileName } = get();
    return files.find((f) => f.name === activeFileName);
  },
}));

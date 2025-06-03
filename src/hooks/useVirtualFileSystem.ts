import { useState, useEffect, useCallback } from "react";
import { VirtualFile, VirtualFileSystem, StoredVFS } from "../types";

const STORAGE_KEY = "rolldown-vfs";

const getLanguageFromPath = (path: string): VirtualFile["language"] => {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "css":
      return "css";
    case "json":
      return "json";
    default:
      return "typescript";
  }
};

const createDefaultFiles = (): VirtualFile[] => [
  {
    path: "/main.tsx",
    content: `import React from 'react';
import Button from '/button.tsx';

export default function App() {
  return (
    <div>
      <Button />
    </div>
  );
}`,
    language: "typescript",
  },
  {
    path: "/button.tsx",
    content: `export default () => {
  return <button>Hello world!</button>
}`,
    language: "typescript",
  },
];

const loadVFSFromStorage = (): VirtualFileSystem => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultFiles = createDefaultFiles();
      const filesMap = new Map<string, VirtualFile>();
      defaultFiles.forEach((file) => filesMap.set(file.path, file));
      return {
        files: filesMap,
        activeFile: "/main.tsx",
        entryPoint: "/main.tsx",
      };
    }

    const parsed: StoredVFS = JSON.parse(stored);
    const files = new Map<string, VirtualFile>();

    Object.entries(parsed.files).forEach(([path, fileData]) => {
      files.set(path, {
        path,
        content: fileData.content,
        language: fileData.language as VirtualFile["language"],
      });
    });

    return {
      files,
      activeFile: parsed.activeFile,
      entryPoint: parsed.entryPoint,
    };
  } catch (error) {
    console.error("Failed to load VFS from storage:", error);
    const defaultFiles = createDefaultFiles();
    const filesMap = new Map<string, VirtualFile>();
    defaultFiles.forEach((file) => filesMap.set(file.path, file));
    return {
      files: filesMap,
      activeFile: "/main.tsx",
      entryPoint: "/main.tsx",
    };
  }
};

const saveVFSToStorage = (vfs: VirtualFileSystem) => {
  try {
    const toStore: StoredVFS = {
      files: Object.fromEntries(
        Array.from(vfs.files.entries()).map(([path, file]) => [
          path,
          { content: file.content, language: file.language },
        ])
      ),
      activeFile: vfs.activeFile,
      entryPoint: vfs.entryPoint,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error("Failed to save VFS to storage:", error);
  }
};

export const useVirtualFileSystem = () => {
  const [vfs, setVfs] = useState<VirtualFileSystem>(loadVFSFromStorage);

  useEffect(() => {
    saveVFSToStorage(vfs);
  }, [vfs]);

  const addFile = useCallback((path: string, content: string = "") => {
    if (!path.startsWith("/")) {
      throw new Error("File path must start with /");
    }

    setVfs((prev) => {
      if (prev.files.has(path)) {
        throw new Error("File already exists");
      }

      const newFile: VirtualFile = {
        path,
        content,
        language: getLanguageFromPath(path),
      };

      const newFiles = new Map(prev.files);
      newFiles.set(path, newFile);

      return {
        ...prev,
        files: newFiles,
        activeFile: path,
      };
    });
  }, []);

  const deleteFile = useCallback((path: string) => {
    setVfs((prev) => {
      if (path === prev.entryPoint) {
        throw new Error("Cannot delete entry point file");
      }

      const newFiles = new Map(prev.files);
      newFiles.delete(path);

      const newActiveFile =
        prev.activeFile === path ? prev.entryPoint : prev.activeFile;

      return {
        ...prev,
        files: newFiles,
        activeFile: newActiveFile,
      };
    });
  }, []);

  const updateFileContent = useCallback((path: string, content: string) => {
    setVfs((prev) => {
      const file = prev.files.get(path);
      if (!file) return prev;

      const newFiles = new Map(prev.files);
      newFiles.set(path, { ...file, content });

      return {
        ...prev,
        files: newFiles,
      };
    });
  }, []);

  const setActiveFile = useCallback((path: string) => {
    setVfs((prev) => ({
      ...prev,
      activeFile: path,
    }));
  }, []);

  return {
    vfs,
    addFile,
    deleteFile,
    updateFileContent,
    setActiveFile,
  };
};

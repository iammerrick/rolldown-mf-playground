export interface VirtualFile {
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'css' | 'json';
}

export interface VirtualFileSystem {
  files: Map<string, VirtualFile>;
  activeFile: string | null;
  entryPoint: string;
}

export interface StoredVFS {
  files: Record<string, { content: string; language: string }>;
  activeFile: string | null;
  entryPoint: string;
}

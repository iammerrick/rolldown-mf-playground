import React, { useState } from 'react';
import { VirtualFile } from '../types';

interface FileManagerProps {
  files: Map<string, VirtualFile>;
  activeFile: string | null;
  entryPoint: string;
  onFileSelect: (path: string) => void;
  onFileAdd: (path: string) => void;
  onFileDelete: (path: string) => void;
}

const getFileIcon = (language: VirtualFile['language']) => {
  switch (language) {
    case 'typescript':
      return '📘';
    case 'javascript':
      return '📙';
    case 'css':
      return '🎨';
    case 'json':
      return '📋';
    default:
      return '📄';
  }
};

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  activeFile,
  entryPoint,
  onFileSelect,
  onFileAdd,
  onFileDelete
}) => {
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    
    try {
      const path = newFileName.startsWith('/') ? newFileName : `/${newFileName}`;
      onFileAdd(path);
      setNewFileName('');
      setIsAddingFile(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add file');
    }
  };

  const handleDeleteFile = (path: string) => {
    if (path === entryPoint) {
      alert('Cannot delete entry point file');
      return;
    }
    
    if (confirm(`Delete ${path}?`)) {
      try {
        onFileDelete(path);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete file');
      }
    }
  };

  const fileList = Array.from(files.values()).sort((a, b) => {
    if (a.path === entryPoint) return -1;
    if (b.path === entryPoint) return 1;
    return a.path.localeCompare(b.path);
  });

  return (
    <div style={{
      width: '250px',
      borderRight: '1px solid #e1e5e9',
      backgroundColor: '#f8f9fa',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Files</h3>
        <button
          onClick={() => setIsAddingFile(true)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px'
          }}
          title="Add file"
        >
          +
        </button>
      </div>

      {isAddingFile && (
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.tsx"
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #d0d7de',
              borderRadius: '4px',
              fontSize: '12px',
              marginBottom: '4px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddFile();
              if (e.key === 'Escape') {
                setIsAddingFile(false);
                setNewFileName('');
              }
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handleAddFile}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: '1px solid #d0d7de',
                borderRadius: '4px',
                backgroundColor: '#f6f8fa',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingFile(false);
                setNewFileName('');
              }}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: '1px solid #d0d7de',
                borderRadius: '4px',
                backgroundColor: '#f6f8fa',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {fileList.map((file) => (
          <div
            key={file.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeFile === file.path ? '#e1f5fe' : 'transparent',
              border: activeFile === file.path ? '1px solid #0969da' : '1px solid transparent',
              marginBottom: '2px',
              fontSize: '12px'
            }}
            onClick={() => onFileSelect(file.path)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{getFileIcon(file.language)}</span>
              <span style={{ 
                fontWeight: file.path === entryPoint ? 600 : 400,
                color: file.path === entryPoint ? '#0969da' : '#24292f'
              }}>
                {file.path.replace('/', '')}
              </span>
              {file.path === entryPoint && (
                <span style={{ fontSize: '10px', color: '#656d76' }}>(entry)</span>
              )}
            </div>
            {file.path !== entryPoint && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.path);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '2px',
                  color: '#656d76',
                  opacity: 0.7
                }}
                title="Delete file"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

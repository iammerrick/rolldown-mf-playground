import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { VirtualFile } from '../types';

interface CodeEditorProps {
  file: VirtualFile | null;
  onChange: (content: string) => void;
}

const getLanguageExtension = (language: VirtualFile['language']) => {
  switch (language) {
    case 'typescript':
    case 'javascript':
      return [javascript({ jsx: true, typescript: language === 'typescript' })];
    case 'css':
      return [css()];
    case 'json':
      return [javascript()];
    default:
      return [javascript({ jsx: true, typescript: true })];
  }
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onChange }) => {
  if (!file) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#656d76',
        fontSize: '14px'
      }}>
        Select a file to edit
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid #e1e5e9',
        backgroundColor: '#f6f8fa',
        fontSize: '12px',
        fontWeight: 600,
        color: '#24292f'
      }}>
        {file.path}
      </div>
      <div style={{ flex: 1 }}>
        <CodeMirror
          value={file.content}
          onChange={onChange}
          extensions={getLanguageExtension(file.language)}
          theme={oneDark}
          style={{
            fontSize: '14px',
            height: '100%'
          }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false
          }}
        />
      </div>
    </div>
  );
};

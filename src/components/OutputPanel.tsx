import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

interface OutputPanelProps {
  output: string | undefined;
  timeCost: number;
  compiling: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  timeCost,
  compiling,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #e1e5e9",
      }}
    >
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid #e1e5e9",
          backgroundColor: "#f6f8fa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#24292f",
          }}
        >
          Output
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#656d76",
          }}
        >
          {compiling ? "Compiling..." : `${timeCost}ms`}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "16px",
          backgroundColor: "#0d1117",
          color: "#f0f6fc",
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        {compiling ? (
          <div style={{ color: "#7c3aed" }}>Compiling...</div>
        ) : output ? (
          <CodeMirror
            value={output}
            editable={false}
            extensions={[javascript()]}
            theme={oneDark}
            style={{
              fontSize: "12px",
              height: "100%",
            }}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false,
              bracketMatching: true,
              closeBrackets: false,
              autocompletion: false,
              highlightSelectionMatches: false,
              searchKeymap: false,
            }}
          />
        ) : (
          <div style={{ color: "#6e7681" }}>
            No output yet. Start typing to see the bundled result.
          </div>
        )}
      </div>
    </div>
  );
};

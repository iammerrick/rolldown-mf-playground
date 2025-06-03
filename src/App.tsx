import { useState, useEffect, useCallback } from "react";
import { rolldown } from "@rolldown/browser";
import { moduleFederationPlugin } from "@rolldown/browser/experimental";
import ansis from "ansis";
import { useVirtualFileSystem } from "./hooks/useVirtualFileSystem";
import { FileManager } from "./components/FileManager";
import { CodeEditor } from "./components/CodeEditor";
import { OutputPanel } from "./components/OutputPanel";
import { ConfigPanel } from "./components/ConfigPanel";
import {
  RolldownConfig,
  DEFAULT_CONFIG,
  CONFIG_STORAGE_KEY,
} from "./types/config";

const MODULE_FEDERATION_STORAGE_KEY = "rolldown-module-federation-enabled";

function App() {
  const { vfs, addFile, deleteFile, updateFileContent, setActiveFile } =
    useVirtualFileSystem();
  const [output, setOutput] = useState<string | undefined>();
  const [timeCost, setTimeCost] = useState(0);
  const [compiling, setCompiling] = useState(false);
  const [moduleFederationEnabled, setModuleFederationEnabled] = useState(false);
  const [config, setConfig] = useState<RolldownConfig>(DEFAULT_CONFIG);

  // Load module federation setting from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(MODULE_FEDERATION_STORAGE_KEY);
      if (stored !== null) {
        setModuleFederationEnabled(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load module federation setting:", error);
    }
  }, []);

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored !== null) {
        const parsedConfig = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...parsedConfig });
      }
    } catch (error) {
      console.error("Failed to load configuration:", error);
    }
  }, []);

  // Save module federation setting to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        MODULE_FEDERATION_STORAGE_KEY,
        JSON.stringify(moduleFederationEnabled)
      );
    } catch (error) {
      console.error("Failed to save module federation setting:", error);
    }
  }, [moduleFederationEnabled]);

  // Save configuration to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error("Failed to save configuration:", error);
    }
  }, [config]);

  const handleModuleFederationToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setModuleFederationEnabled(event.target.checked);
    },
    []
  );

  const handleConfigChange = useCallback((newConfig: RolldownConfig) => {
    setConfig(newConfig);
  }, []);

  const compile = useCallback(async () => {
    if (compiling || vfs.files.size === 0) return;
    setCompiling(true);

    // Convert VFS to Map<string, string> for rolldown
    const vfsMap = new Map<string, string>();
    vfs.files.forEach((file, path) => {
      vfsMap.set(path, file.content);
    });

    const t = performance.now();
    try {
      const build = await rolldown({
        external: config.external,
        input: [vfs.entryPoint],
        cwd: "/",
        platform: config.platform,
        treeshake: config.treeshake,
        plugins: [
          {
            name: "vfs",
            resolveId: (id) => id,
            load(id) {
              if (vfsMap.has(id)) {
                return vfsMap.get(id)!;
              }
              console.log(`File not found: ${JSON.stringify(id)}`);
            },
          },
          ...(moduleFederationEnabled
            ? [
                moduleFederationPlugin({
                  name: "mf-remote",
                  filename: "remote-entry.js",
                  exposes: {
                    "./main": vfs.entryPoint,
                  },
                  shared: {
                    react: {
                      singleton: true,
                    },
                  },
                  manifest: true,
                  getPublicPath: "http://localhost:8085/",
                }),
              ]
            : []),
        ],
      });
      const { output: chunks } = await build.generate({
        dir: config.dir,
        format: config.format,
        sourcemap: config.sourcemap,
        minify: config.minify,
        entryFileNames: config.entryFileNames,
        chunkFileNames: config.chunkFileNames,
      });

      setOutput(
        chunks
          .map(
            (chunk) =>
              `//${chunk.fileName}\n${"code" in chunk ? chunk.code : chunk.source}`
          )
          .join("\n")
      );
    } catch (err: any) {
      setOutput(ansis.strip(err.toString()));
      console.error(err);
    } finally {
      setTimeCost(+(performance.now() - t).toFixed(2));
      setCompiling(false);
    }
  }, [vfs, moduleFederationEnabled, config]);

  useEffect(() => {
    compile();
  }, [compile]);

  const activeFile = vfs.activeFile
    ? vfs.files.get(vfs.activeFile) || null
    : null;

  const handleFileContentChange = (content: string) => {
    if (vfs.activeFile) {
      updateFileContent(vfs.activeFile, content);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e1e5e9",
          backgroundColor: "#f6f8fa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 600,
            color: "#24292f",
          }}
        >
          Rolldown on Browser
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#24292f",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={moduleFederationEnabled}
              onChange={handleModuleFederationToggle}
              style={{
                margin: 0,
                cursor: "pointer",
              }}
            />
            Module Federation
          </label>
          <ConfigPanel config={config} onConfigChange={handleConfigChange} />
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            borderRight: "1px solid #e1e5e9",
          }}
        >
          <FileManager
            files={vfs.files}
            activeFile={vfs.activeFile}
            entryPoint={vfs.entryPoint}
            onFileSelect={setActiveFile}
            onFileAdd={addFile}
            onFileDelete={deleteFile}
          />
          <CodeEditor file={activeFile} onChange={handleFileContentChange} />
        </div>

        <OutputPanel
          output={output}
          timeCost={timeCost}
          compiling={compiling}
        />
      </div>
    </div>
  );
}

export default App;

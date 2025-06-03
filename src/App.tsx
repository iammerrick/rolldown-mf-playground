import { useState, useEffect } from "react";
import { rolldown } from "@rolldown/browser";
import { moduleFederationPlugin } from "@rolldown/browser/experimental";
import ansis from "ansis";

function App() {
  const [code, setCode] = useState(() => {
    return localStorage.getItem("code") || "";
  });
  const [output, setOutput] = useState<string | undefined>();
  const [timeCost, setTimeCost] = useState(0);
  const [compiling, setCompiling] = useState(false);

  async function compile() {
    if (compiling) return;
    setCompiling(true);

    const mainCode = code;
    const vfs = new Map<string, string>([["/main.tsx", mainCode]]);

    const t = performance.now();
    try {
      const build = await rolldown({
        external: [
          "react/jsx-runtime",
          "react",
          "react-dom",
          "@webflow/react",
          "@webflow/data-types",
          "@module-federation/runtime",
        ],
        input: ["/main.tsx"],
        cwd: "/",
        plugins: [
          {
            name: "vfs",
            resolveId: (id) => id,
            load(id) {
              if (vfs.has(id)) {
                return vfs.get(id)!;
              }
              console.log(`File not found: ${JSON.stringify(id)}`);
            },
          },
          moduleFederationPlugin({
            name: "mf-remote",
            filename: "remote-entry.js",
            exposes: {
              "./main": "/main.tsx",
            },
            shared: {
              react: {
                singleton: true,
              },
            },
            manifest: true,
            getPublicPath: "http://localhost:8085/",
          }),
        ],
      });
      const { output: chunks } = await build.generate({
        dir: "dist",
      });
      // await build.close()

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
      return;
    } finally {
      setTimeCost(+(performance.now() - t).toFixed(2));
      setCompiling(false);
    }

    if (code !== mainCode) {
      compile();
    }
  }

  useEffect(() => {
    localStorage.setItem("code", code);
    compile();
  }, [code]);

  useEffect(() => {
    compile();
  }, []);

  return (
    <>
      <h1>Rolldown on Browser</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
        style={{ width: "500px", height: "200px" }}
      />
      <div>{compiling ? " compiling..." : `${timeCost} ms`}</div>
      <pre>{output}</pre>
    </>
  );
}

export default App;

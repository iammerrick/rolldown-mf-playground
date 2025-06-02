import { useState, useEffect } from "react";
import { rolldown } from "@rolldown/browser";
import ansis from "ansis";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | undefined>();
  const [timeCost, setTimeCost] = useState(0);
  const [compiling, setCompiling] = useState(false);

  async function compile() {
    if (compiling) return;
    setCompiling(true);

    const mainCode = code;
    const vfs = new Map<string, string>([["/main.ts", mainCode]]);

    const t = performance.now();
    try {
      const build = await rolldown({
        input: ["/main.ts"],
        cwd: "/",
        plugins: [
          {
            name: "vfs",
            resolveId: (id) => id,
            load(id) {
              if (vfs.has(id)) {
                return vfs.get(id)!;
              }
              throw new Error(`File not found: ${JSON.stringify(id)}`);
            },
          },
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

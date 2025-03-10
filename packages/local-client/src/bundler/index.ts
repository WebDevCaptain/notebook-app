import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let initialize;

const bundle = async (rawCode: string) => {
  if (!initialize) {
    initialize = esbuild.initialize({
      worker: true,
      // wasmURL: "/esbuild.wasm",
      wasmURL: "https://unpkg.com/esbuild-wasm@0.25.1/esbuild.wasm",
    });

    await initialize;
  }

  try {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });

    return {
      code: result.outputFiles[0].text,
      error: "",
    };
  } catch (err: any) {
    return {
      code: "",
      error: err.message,
    };
  }
};

export default bundle;

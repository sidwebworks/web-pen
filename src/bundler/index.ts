import { build, initialize as initializeEsbuild, Loader } from "esbuild-wasm";
import loaderPlugin from "./plugins/loader.plugin";
import resolver from "./plugins/resolver.plugin";

const WASM_URL = "https://unpkg.com/esbuild-wasm@0.14.42/esbuild.wasm";

interface BundlerOptions {
  wasmUrl?: string;
}

export type BuildInput = {
  entry: string;
  loader: Loader;
  tree: Record<string, string>;
};

class Bundler {
  static initialized: boolean = false;
  wasmUrl: string;
  prev: string = "";

  constructor(options?: BundlerOptions) {
    this.wasmUrl = options?.wasmUrl || WASM_URL;
  }

  async initialize() {
    if (!Bundler.initialized) {
      Bundler.initialized = true;
      try {
        await initializeEsbuild({
          wasmURL: this.wasmUrl,
          worker: true,
        });
      } catch (error: any) {
        console.error(error);
      }
    }

    return Bundler.initialized;
  }

  async build({ entry, tree }: Omit<BuildInput, "loader">) {
    const loader = (entry.split(".").slice(-1)[0] || "js") as Loader;

    const result = await build({
      bundle: true,
      write: false,
      entryPoints: [entry],
      define: {
        "process.env.NODE_ENV": `"production"`,
        global: "window",
      },
      target: ["ES2020"],
      platform: "browser",
      plugins: [
        resolver({ entry, loader, tree }),
        loaderPlugin({
          tree,
          entry,
          loader,
        }),
      ],
    });

    return result;
  }
}

export default Bundler;

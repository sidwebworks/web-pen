import {
  build,
  BuildOptions,
  initialize as initializeEsbuild,
  Loader,
} from "esbuild-wasm";
import loaderPlugin from "./plugins/loader.plugin";
import resolver from "./plugins/resolver.plugin";
import { codeFrameColumns } from "@babel/code-frame";
import { getLoaderFromPath } from "./plugins/helpers";
import { BundlingError } from "./errors";
import { unix } from "path-fx";

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

  config: BuildOptions = {
    bundle: true,
    write: false,
    platform: "browser",
    jsx: "transform",
    jsxFactory: "React.createElement",
    format: "esm",
    define: {
      "process.env.NODE_ENV": `"production"`,
      global: "window",
    },
    target: ["ES2020"],
  };

  constructor(options?: BundlerOptions) {
    this.wasmUrl = options?.wasmUrl || WASM_URL;
  }

  async initialize() {
    if (!Bundler.initialized) {
      try {
        await initializeEsbuild({
          wasmURL: this.wasmUrl,
          worker: true,
        });
        Bundler.initialized = true;
      } catch (error: any) {
        Bundler.initialized = false;
      }
    }

    return Bundler.initialized;
  }

  async build({ entry, tree }: Omit<BuildInput, "loader">) {
    if (!Bundler.initialized) {
      await this.initialize();
    }
    const loader = getLoaderFromPath(entry, "js");

    const result = await build({
      ...this.config,
      entryPoints: [entry],
      plugins: [
        resolver({ entry, loader, tree }),
        loaderPlugin({
          tree,
          entry,
          loader,
        }),
      ],
    }).catch((err) => {
      const meta = getErrorLineMeta(err.message);

      if (typeof meta === "string") {
        throw new BundlingError({ file: "", message: meta });
      }

      const code = tree[unix.join("/", meta.filename)];

      const frame = codeFrameColumns(code, meta, {
        message: err.message.split("ERROR:")[1].trim(),
        linesBelow: 4,
        linesAbove: 2,
      });

      console.clear();

      throw new BundlingError({ file: meta.filename, message: frame });
    });

    return result;
  }
}

const getErrorLineMeta = (message: string) => {
  if (message.includes(`Do not know how to load`)) {
    return message.replace("a:/", "/");
  }

  const parts = message
    .match(/:.?\/?\w+\.\w+[^:]+:[\d]:\d+:/g)[0]
    .split(":")
    .filter(Boolean);

  const filename = parts[0].replace("./", "/");

  const line = parts[1];

  const col = parts[2];

  return { filename, start: { column: Number(col), line: Number(line) } };
};

export default Bundler;

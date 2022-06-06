import { Loader, OnLoadResult } from "esbuild-wasm";
import { unix as path } from "path-fx";
import { BuildInput } from "..";

import { createPlugin, getLoaderFromPath } from "./helpers";

const plugin = createPlugin<BuildInput>((options) => ({
  name: "loader-plugin",
  setup(build) {
    build.onLoad({ filter: new RegExp(path.join(options.entry)) }, (args) => {
      return {
        loader: getLoaderFromPath(args.path, options.loader),
        contents: options.tree[`/${path.join(options.entry)}`],
      };
    });

    build.onLoad({ filter: /.*/ }, async (args) => {
      return null;
    });

    build.onLoad({ filter: /.*/ }, async (args) => {
      const contents = options.tree[args.path.replace(".", "")] || "";

      const result: OnLoadResult = {
        loader: getLoaderFromPath(args.path, options.loader),
        contents,
        resolveDir: args.path,
      };

      return result;
    });

    // build.onLoad({ filter: /.css$/ }, async (args: any) => {
    //   const { data, request } = await axios.get(args.path);

    //   const contents = normalizeCss(data);

    //   const result: OnLoadResult = {
    //     loader: "jsx",
    //     contents,
    //     resolveDir: new URL("./", request.responseURL).pathname,
    //   };

    //   await fileCache.setItem(args.path, result);

    //   return result;
    // });

    // build.onLoad({ filter: /.*/ }, async (args) => {
    //   const result: OnLoadResult = {
    //     loader: "jsx",
    //     contents: "",
    //     resolveDir: new URL("./", args.path).pathname,
    //   };

    //   return result;
    // });
  },
}));

export default plugin;

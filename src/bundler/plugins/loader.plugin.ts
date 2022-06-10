import { Loader, OnLoadResult } from "esbuild-wasm";
import { unix as path } from "path-fx";
import { BuildInput } from "..";
import { BundlingError } from "../errors";

import { createPlugin, getLoaderFromPath } from "./helpers";

const plugin = createPlugin<BuildInput>((options) => ({
  name: "loader-plugin",
  setup(build) {
    build.onLoad(
      { filter: new RegExp(path.join(options.entry)), namespace: "entry" },
      (args) => {
        const contents = options.tree[path.join(options.entry)];

        if (!contents) {
          return null;
        }

        return {
          loader: getLoaderFromPath(args.path, options.loader),
          contents,
        };
      }
    );

    /**
     * Resolve relative modules imports
     */
    build.onLoad({ filter: /^\.+\//, namespace: "relative" }, (args) => {
      const contents = options.tree[path.join("/", args.path)];

      if (!contents) return null;

      return {
        loader: getLoaderFromPath(args.path, options.loader),
        contents,
      };
    });

    build.onLoad(
      { filter: /^https?:\/\//, namespace: "skypack" },
      async (args) => {
        try {
          const contents = await (await fetch(args.path)).text();

          if (!contents) {
            return null;
          }

          const result: OnLoadResult = {
            loader: "js",
            contents,
            resolveDir: args.path,
          };

          return result;
        } catch (error) {
          console.error(error);

          throw new BundlingError({
            file: args.path,
            message: `Unable to load module ${args.path.split("/").at(-1)}`,
          });
        }
      }
    );

    build.onLoad({ filter: /.*/, namespace: "main" }, async (args) => {
      const contents = options.tree[args.path] || options.tree["/" + args.path];

      if (!contents) {
        return null;
      }

      const result: OnLoadResult = {
        loader: getLoaderFromPath(args.path, options.loader),
        contents,
        resolveDir: args.path,
      };

      return result;
    });
  },
}));

export default plugin;

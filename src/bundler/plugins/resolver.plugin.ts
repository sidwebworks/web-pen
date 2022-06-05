import { unix as path } from "path-fx";
import { BuildInput } from "..";
import { createPlugin } from "./helpers";

const UNPKG_PATH = "https://unpkg.com";

const plugin = createPlugin<BuildInput>((options) => ({
  name: "resolve-plugin",
  setup(build) {
    /**
     * Resolve the entry file eg. `index.js`
     */
    build.onResolve(
      { filter: new RegExp(path.join(options.entry)) },
      (args: any) => {
        return { path: args.path, namespace: "a" };
      }
    );

    /**
     * Resolve relative modules imports
     */
    build.onResolve({ filter: /^\.+\// }, (args) => {
      return {
        namespace: "a",
        path: args.path,
      };

      // // const url = new URL(args.path, UNPKG_PATH + args.resolveDir + "/").href;
      // return {
      //   namespace: "a",
      //   path: "",
      // };
    });

    /**
     * Resolve main module files
     */
    // build.onResolve({ filter: /.*/ }, async (args: any) => {
    //   return {
    //     namespace: "a",
    //     path: new URL(args.path, UNPKG_PATH + "/").href,
    //   };
    // });
  },
}));

export default plugin;

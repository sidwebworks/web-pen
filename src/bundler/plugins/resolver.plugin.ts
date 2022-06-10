import { unix } from "path-fx";
import { ADD_TYPE } from "src/lib/store/slices/editor";
import store from "src/lib/store/store";
import { BuildInput } from "..";
import { createPlugin } from "./helpers";

const plugin = createPlugin<BuildInput>((options) => ({
  name: "resolve-plugin",
  setup(build) {
    /**
     * Resolve the entry file eg. `index.js`
     */
    build.onResolve(
      { filter: new RegExp(unix.join("/", options.entry)) },
      (args) => {
        return { path: args.path, namespace: "entry" };
      }
    );

    /**
     * Resolve relative modules imports
     */
    build.onResolve({ filter: /^\.+\// }, (args) => {
      return {
        namespace: "relative",
        path: args.path,
      };
    });

    /**
     * Resolve main module files
     */
    build.onResolve({ filter: /.*/ }, async (args) => {
      let path = unix.join("/", args.path);

      if (path in options.tree) {
        return {
          namespace: "main",
          path,
        };
      }

      path = new URL(args.path, "https://cdn.skypack.dev").href;

      store.dispatch(ADD_TYPE(args.path));

      return {
        namespace: "skypack",
        path: path,
        external: true,
      };
    });
  },
}));

export default plugin;

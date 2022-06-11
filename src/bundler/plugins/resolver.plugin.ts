import { unix } from "path-fx";
import { ADD_TYPE } from "src/lib/store/slices/editor";
import store from "src/lib/store/store";
import { BuildInput } from "..";
import { createPlugin } from "./helpers";

const extractPkgName = (str: string) =>
  str.match(/\w.*@v\d+.\d+.\d/g)?.[0] || "";

const plugin = createPlugin<BuildInput>((options) => {
  return {
    name: "resolve-plugin",
    setup(build) {
      const resolveCache = new Set();

      /**
       * Resolve the entry file eg. `index.js`
       */
      build.onResolve(
        { filter: new RegExp(unix.join("/", options.entry)) },
        () => {
          return { path: unix.join(options.entry), namespace: "entry" };
        }
      );

      /**
       * Resolve relative modules imports
       */
      build.onResolve({ filter: /^\.+\// }, (args) => {
        if (args.path in options.tree) {
          return {
            namespace: "relative",
            path: unix.join("/", args.path),
          };
        }
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

        const pkg = extractPkgName(args.path);

        // Skip sub modules
        if (pkg && args.path.includes(pkg) && !resolveCache.has(pkg)) {
          console.warn("LOADING MODULE TYPES", pkg);
          store.dispatch(ADD_TYPE(pkg));
          resolveCache.add(pkg);
        }

        return {
          namespace: "skypack",
          path: path,
        };
      });
    },
  };
});

export default plugin;

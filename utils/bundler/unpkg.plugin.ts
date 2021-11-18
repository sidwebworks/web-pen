import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const unpkg_path = "http://unpkg.com";

const fileCache = localforage.createInstance({
	name: "filecache",
});

export const unpkgPathPlugin = () => {
	return {
		name: "unpkg-path-plugin",
		setup(build: esbuild.PluginBuild) {
			build.onResolve({ filter: /.*/ }, async (args: any) => {
				console.log("onResole", args);

				// handle base imports
				if (args.path === "index.js") {
					return { path: args.path, namespace: "a" };
				}

				// handle relative imports
				if (args.path.includes("./") || args.path.includes("../")) {
					return {
						namespace: "a",
						path: new URL(args.path, `${unpkg_path}${args.resolveDir}/`).href,
					};
				}

				// handle all other imports
				return {
					namespace: "a",
					path: new URL(args.path, unpkg_path + "/").href,
				};
			});

			build.onLoad({ filter: /.*/ }, async (args: any) => {
				console.log("onLoad", args);

				if (args.path === "index.js") {
					return {
						loader: "jsx",
						contents: `
              const message = require('react');
              console.log(message);
            `,
					};
				}

				/**
				 * Check if module is already in filecache
				 * if yes? return it immediately
				 * 
				 * if not, fetch it from unpkg and cache it
				 * and return the result
				 */
				const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

				if (cachedResult) {
					return cachedResult;
				}

				const { data, request } = await axios.get(args.path);

				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents: data,
					resolveDir: new URL("./", request.responseURL).pathname,
				};

				await fileCache.setItem(args.path, result);

				return result;
			});
		},
	};
};

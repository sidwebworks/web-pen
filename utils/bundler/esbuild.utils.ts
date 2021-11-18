import * as esbuild from "esbuild-wasm";
import { fetchPlugin } from "./fetch.plugin";
import { unpkgPathPlugin } from "./unpkg-path.plugin";

export const startService = () => {
	return esbuild.initialize({
		wasmURL: "https://unpkg.com/esbuild-wasm@0.13.14/esbuild.wasm",
		worker: true,
	});
};

export const normalizeCss = (data: string) => {
	/**
	 * Function to remove any new lines, quotes from imported css packages.
	 */
	const escaped = data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");
	return `const style = document.createElement('style')
	style.innerText = '${escaped}';
	document.head.appendChild(style)`;
};

export const bundleService = (config: esbuild.BuildOptions, value: string) => {
	return esbuild.build({
		...config,
		bundle: true,
		write: false,
		plugins: [unpkgPathPlugin(), fetchPlugin(value)],
		define: {
			"process.env.NODE_ENV": `"production"`,
			global: "window",
		},
	});
};

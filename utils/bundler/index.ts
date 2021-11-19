import { build, BuildOptions, initialize } from "esbuild-wasm";
import { fetchPlugin } from "./fetch.plugin";
import { unpkgPathPlugin } from "./unpkg-path.plugin";

let serviceLoaded: boolean | null = null;

const bundler = async (rawCode: string) => {
	if (!serviceLoaded) {
		await initialize({
			wasmURL: "https://unpkg.com/esbuild-wasm@0.13.14/esbuild.wasm",
			worker: true,
		});
		serviceLoaded = true;
	}

	const result = await build({
		entryPoints: ["index.js"],
		outdir: "public/code",
		bundle: true,
		write: false,
		plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
		define: {
			"process.env.NODE_ENV": `"production"`,
			global: "window",
		},
	});

	return result.outputFiles[0].text;
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

export default bundler;

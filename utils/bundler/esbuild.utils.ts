import * as esbuild from "esbuild-wasm";

export const startService = () => {
	return esbuild.initialize({
		wasmURL: "/esbuild.wasm",
		worker: true,
	});
};

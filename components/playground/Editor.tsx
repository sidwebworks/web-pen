import * as esbuild from "esbuild-wasm";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { startService } from "../../utils/bundler/esbuild.utils";
import { fetchPlugin } from "../../utils/bundler/fetch.plugin";
import { unpkgPathPlugin } from "../../utils/bundler/unpkg-path.plugin";

export const Editor: React.FC = (props) => {
	const [value, setValue] = useState("");
	const [output, setOutput] = useState("");
	const isInitialized = useRef<boolean>(false);

	useEffect(() => {
		if (isInitialized.current) return;

		startService().then(() => {
			isInitialized.current = true;
			setOutput("");
		});
	}, []);

	const handleBuild = async () => {
		if (!isInitialized.current) return;

		const result = await esbuild.build({
			entryPoints: ["index.js"],
			bundle: true,
			write: false,
			plugins: [unpkgPathPlugin(), fetchPlugin(value)],
			define: {
				"process.env.NODE_ENV": `"production"`,
				global: "window",
			},
		});

		setOutput(result.outputFiles[0].text);
	};

	return (
		<section>
			<textarea onChange={(e) => setValue(e.target.value)} value={value}></textarea>
			<button onClick={handleBuild}>Transpile</button>
			<pre>{output}</pre>
		</section>
	);
};

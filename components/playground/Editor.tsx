import React, { useEffect, useRef, useState } from "react";
import { bundleService, startService } from "../../utils/bundler/esbuild.utils";

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

		const result = await bundleService(
			{
				entryPoints: ["index.js"],
			},
			value
		);

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

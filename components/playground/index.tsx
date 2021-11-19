import { createContext, useEffect, useMemo, useState } from "react";
import { ICodeEditor } from "../../typings/types";
import bundler from "../../utils/bundler";
import { Editor, OptionsPanel } from "./Editor";
import { Preview } from "./Preview";
import { Resizeable } from "./Resizeable";

const initialSnippet = `
import React from "react"
import ReactDOM from "react-dom"

const App = () => {
	return(<h1>Hello React!</h1>)
}

ReactDOM.render(<App/>, document.querySelector("#root"))
`;

const Playground = () => {
	const [input, setInput] = useState(initialSnippet);
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const timeout = setTimeout(async () => {
			const { code, err } = await bundler(input);
			setOutput(code);
			setError(err);
		}, 750);

		return () => clearTimeout(timeout);
	}, [input]);

	return (
		<>
			<OptionsPanel />
			<div className="flex flex-row flex-grow h-full">
				<Resizeable direction="horizontal">
					<Editor onChange={setInput} intialValue={initialSnippet} />
				</Resizeable>
				<Preview code={output} error={error} setError={setError} />
			</div>
		</>
	);
};

export default Playground;

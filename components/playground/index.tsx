import { createContext, useEffect, useMemo, useState } from "react";
import { ICodeEditor } from "../../typings/types";
import bundler from "../../utils/bundler";
import { useDebouncedState } from "../../utils/hooks/use-debounced-state";
import { Editor, OptionsPanel } from "./Editor";
import { Preview } from "./Preview";
import { Resizeable } from "./Resizeable";

const initialSnippet = `
import React from "react"
import ReactDOM from "react-dom"
import Select from "react-select"

const App = () => {
	return(<> <h1>Hello React!</h1> <Select/> </>)
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
		}, 600);

		return () => clearTimeout(timeout);
	}, [input]);

	return (
		<>
			<div className="flex flex-row flex-grow h-full">
				<Resizeable direction="horizontal">
					<Editor onChange={setInput} intialValue={initialSnippet} />
					<Preview code={output} error={error} setError={setError} />
				</Resizeable>
			</div>
		</>
	);
};

export default Playground;

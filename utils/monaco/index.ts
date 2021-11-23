import { MonacoOptions } from "../typings/types";

export const MonacoConfig: MonacoOptions = {
	wordWrap: "off",
	minimap: { enabled: false },
	showUnused: false,
	folding: true,
	padding: {
		top: 10,
		bottom: 70,
	},
	cursorBlinking: "expand",
	lineNumbersMinChars: 3,
	fontSize: 16,
	contextmenu: true,
	scrollBeyondLastLine: false,
};

export const defaultSnippets = {
	html: `<div id="root"></div>`,
	js: [
		"import React from 'react';",
		"import ReactDOM from 'react-dom';",
		"import Select from 'react-select';",
		"",
		"const App = () => <div>Hello React! <Select /> </div>",
		"",
		"ReactDOM.render(<App />, document.querySelector('#root'));",
	].join("\n"),
	css: ["body {", " background-color: white;", "}"].join("\n"),
};

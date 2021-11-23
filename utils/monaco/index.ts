import { Monaco, OnMount } from "@monaco-editor/react";
import store from "../../redux";
import { CompilerOptions, MonacoOptions } from "../typings/types";
import { registerEmmet } from "./plugins/emmet";
import { registerDocumentPrettier } from "./plugins/register-prettier";
import { registerSyntaxHighlighter } from "./plugins/syntax-highlight-support";

export const initMonaco = (monaco: Monaco) => {
	monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
	monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);

	monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
	monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

	monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: true,
		noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
	});

	/**
	 * Configure the typescript compiler to detect JSX and load type definitions
	 */

	const opts: CompilerOptions = {
		allowJs: true,
		allowSyntheticDefaultImports: true,
		alwaysStrict: true,
		reactNamespace: "React",
		noEmit: true,
		jsx: monaco.languages.typescript.JsxEmit.React,
		allowNonTsExtensions: true,
		target: monaco.languages.typescript.ScriptTarget.ES2016,
		jsxFactory: "React.createElement",
	};

	monaco.languages.typescript.typescriptDefaults.setCompilerOptions(opts);
	monaco.languages.typescript.javascriptDefaults.setCompilerOptions(opts);
};

export const initWorkers: OnMount = (editor, monaco) => {
	registerSyntaxHighlighter(editor, monaco);
	registerDocumentPrettier(editor, monaco);
	const { dispose } = registerEmmet(monaco);

	return () => {
		dispose.jsx();
		dispose.html();
		dispose.css();
	};
};

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

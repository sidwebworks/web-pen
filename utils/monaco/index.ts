import { Monaco, OnMount } from "@monaco-editor/react";
import { editor as Internalmonaco } from "monaco-editor";
import store from "../../redux";
import { registerEmmet } from "./plugins/emmet";
import { registerDocumentPrettier } from "./plugins/register-prettier";

export const initMonaco = (monaco: Monaco) => {
	const files = store.getState()?.editor.files;

	files.forEach((el) => {
		const uri = monaco.Uri.parse(el.filename);
		monaco.editor.createModel(el.value, el.language, uri);
	});

	monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
	monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);

	monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
	monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

	/**
	 * Configure the typescript compiler to detect JSX and load type definitions
	 */
	const compilerOptions: any = {
		allowJs: true,
		allowSyntheticDefaultImports: true,
		alwaysStrict: true,
		allowNonTsExtensions: true,
		jsxFactory: "React.createElement",
	};

	monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
	monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
};

export const initWorkers: OnMount = (editor, monaco) => {
	// registerSyntaxHighlighter(editor, monaco);
	registerDocumentPrettier(editor, monaco);
	const { dispose } = registerEmmet(monaco);
	// registerAutoCompletion(monaco);

	return () => {
		dispose.jsx();
		dispose.html();
		dispose.css();
	};
};

export const MonacoConfig: Internalmonaco.IStandaloneEditorConstructionOptions = {
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

import { Monaco, OnMount } from "@monaco-editor/react";
import { editor as Internalmonaco } from "monaco-editor";
import store from "../../redux";
import { registerEmmet } from "./plugins/emmet";
import { registerDocumentPrettier } from "./plugins/register-prettier";
import theme from "./theme/night-owl.json";


export const initMonaco = (monaco: Monaco) => {
	monaco.editor.defineTheme("night-owl", theme as any);

	const files = store.getState().code.files;

	files.forEach((el) => {
		monaco.editor.createModel(el.value, el.language, monaco.Uri.parse(el.filename));
	});

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
	wordWrap: "on",
	minimap: { enabled: false },
	showUnused: false,
	folding: false,
	padding: {
		top: 10,
		bottom: 10,
	},
	cursorBlinking: "expand",
	lineNumbersMinChars: 3,
	fontSize: 16,
	contextmenu: true,
	scrollBeyondLastLine: false,
};


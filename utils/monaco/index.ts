import { editor as Internalmonaco } from "monaco-editor";
import { Monaco, OnMount } from "@monaco-editor/react";
import { registerEmmet } from "./plugins/emmet";
import { registerDocumentPrettier } from "./plugins/register-prettier";
import { registerSyntaxHighlighter } from "./plugins/syntax-highlight-support";
import theme from "./theme/night-owl.json";

export const initMonaco = (monaco: Monaco) => {
	monaco.editor.defineTheme("night-owl", theme as any);

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
		noLib: true,
		allowNonTsExtensions: true,
		jsx: "React",
		jsxFactory: "React.createElement",
	};

	monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
	monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
};

export const initWorkers: OnMount = (editor, monaco) => {
	registerSyntaxHighlighter(editor, monaco);
	registerDocumentPrettier(editor, monaco);
	registerEmmet(monaco);
};

export const MonacoConfig: Internalmonaco.IStandaloneEditorConstructionOptions = {
	wordWrap: "bounded",
	minimap: { enabled: false },
	showUnused: false,
	folding: true,
	quickSuggestions: true,
	padding: {
		top: 10,
		bottom: 10,
	},
	cursorBlinking: "expand",
	fontLigatures: true,
	automaticLayout: true,
	lineNumbersMinChars: 3,
	fontSize: 16,
	contextmenu: true,
	scrollBeyondLastLine: false,
};

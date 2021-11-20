import { Monaco, OnMount } from "@monaco-editor/react";
import { registerEmmet } from "./plugins/emmet";
import { registerDocumentPrettier } from "./plugins/register-prettier";
import { registerSyntaxHighlighter } from "./plugins/syntax-highlight-support";
import theme from "./theme/night-owl.json";

export const initMonaco = (monaco: Monaco) => {
	// const themeData = JSON.parse(theme);
	monaco.editor.defineTheme("night-owl", theme as any);

	// /**
	//  * Sync all the models to the worker eagerly.
	//  * This enables intelliSense for all files without needing an `addExtraLib` call.
	//  */
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

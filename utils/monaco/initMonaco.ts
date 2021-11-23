import { Monaco } from "@monaco-editor/react";
import { CompilerOptions } from "../typings/types";

export const initMonaco = (monaco: Monaco) => {
	
	monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
	monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);

	monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
	monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

	monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: true,
		noSyntaxValidation: false,
	});

	monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
		target: monaco.languages.typescript.ScriptTarget.ES2020,
		allowNonTsExtensions: true,
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

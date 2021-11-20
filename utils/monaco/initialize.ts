import { Monaco } from "@monaco-editor/react";
import theme from "./theme/night-owl.json";

export const initMonaco = (monaco: Monaco) => {
	/**
	 * Disable typescript's diagnostics for JavaScript files.
	 * This suppresses errors when using Flow syntax.
	 * It's also unnecessary since we use ESLint for error checking.
	 */
	// monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
	// 	noSemanticValidation: true,
	// 	noSyntaxValidation: true,
	// });

	/**
	 * Use prettier to format JavaScript code.
	 * This will replace the default formatter.
	 */

	// monaco.languages.registerDocumentFormattingEditProvider("javascript", {
	// 	async provideDocumentFormattingEdits(model, options, token) {
	// 		const prettier = await import("prettier");
	// 		const parser = await import("prettier/parser-babel");
	// 		const formatted = prettier.format(model.getValue() || "", {
	// 			parser: "babel",
	// 			plugins: [parser],
	// 			useTabs: false,
	// 			semi: true,
	// 			singleQuote: true,
	// 		});

	// 		return [
	// 			{
	// 				range: model.getFullModelRange(),
	// 				text: formatted,
	// 			},
	// 		];
	// 	},
	// });

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

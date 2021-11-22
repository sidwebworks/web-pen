import * as monaco from "monaco-editor";

export type ICodeEditor = editor.IStandaloneCodeEditor;
export type EditorSettings = editor.IStandaloneEditorConstructionOptions;

export type File = {
	value: string;
	filename: string;
	language: EditorLanguages;
	uri: null | typeof Uri;
};

export type Files = "index.html" | "styles.css" | "app.js";

export type EditorLanguages = "javascript" | "html" | "css";

export type Methods =
	| "log"
	| "debug"
	| "info"
	| "warn"
	| "error"
	| "table"
	| "clear"
	| "time"
	| "timeEnd"
	| "count"
	| "assert";

export interface ConsoleLog {
	method: Methods;
	data: any[];
	id?: string;
}

export type BundleOutput =
	| {
			code: string;
			err: null;
	  }
	| {
			code: string;
			err: {
				method: string;
				data: any[];
				id: string;
			};
	  };

export type MonacoOptions = monaco.IStandaloneEditorConstructionOptions;

export type CompilerOptions = monaco.languages.typescript.CompilerOptions;

import { editor } from "monaco-editor";

export const MonacoConfig: editor.IStandaloneEditorConstructionOptions = {
	wordWrap: "on",
	minimap: { enabled: false },
	showUnused: false,
	folding: false,
	padding: {
		top: 10,
		bottom: 10,
	},
	automaticLayout: true,
	lineNumbersMinChars: 3,
	fontSize: 16,
	contextmenu: true,
	scrollBeyondLastLine: false,
};

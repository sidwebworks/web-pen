import { OnMount } from "@monaco-editor/react";
import { registerEmmet } from "./plugins/emmet";
import { registerDocumentPrettier } from "./plugins/register-prettier";
import { registerSyntaxHighlighter } from "./plugins/syntax-highlight-support";

export const initEditor: OnMount = (editor, monaco) => {
	registerSyntaxHighlighter(editor, monaco);
	registerDocumentPrettier(editor, monaco);
	const { dispose } = registerEmmet(monaco);

	return () => {
		dispose.jsx();
		dispose.html();
		dispose.css();
	};
};

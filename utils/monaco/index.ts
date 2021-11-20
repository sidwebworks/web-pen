import { Monaco, OnMount } from "@monaco-editor/react";
import { editor as Internalmonaco } from "monaco-editor";
import { ICodeEditor } from "../../typings/types";
import { createWorkerQueue } from "../../workers/";

export const MonacoConfig: Internalmonaco.IStandaloneEditorConstructionOptions = {
	wordWrap: "bounded",
	minimap: { enabled: false },
	showUnused: false,
	folding: true,
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

export const initWorkers: OnMount = (editor, monaco) => {
	registerSyntaxHighlighter(editor, monaco);
	registerDocumentFormattingEditProviders(editor, monaco);
};

function registerDocumentFormattingEditProviders(editor: ICodeEditor, monaco: Monaco) {
	const disposables: any = [];
	let prettierWorker: any;

	const formattingEditProvider = {
		async provideDocumentFormattingEdits(model: any, _options: any, _token: any) {
			if (!prettierWorker) {
				prettierWorker = createWorkerQueue(
					new Worker(new URL("../../workers/prettier.worker.js", import.meta.url))
				);
			}

			const { canceled, error, pretty } = await prettierWorker?.emit({
				text: model.getValue(),
				language: model.getModeId(),
			});

			if (canceled || error) return [];
			return [
				{
					range: model.getFullModelRange(),
					text: pretty,
				},
			];
		},
	};

	// override the built-in HTML formatter
	const _registerDocumentFormattingEditProvider =
		monaco.languages.registerDocumentFormattingEditProvider;
	monaco.languages.registerDocumentFormattingEditProvider = (id, provider) => {
		if (id !== "html") {
			return _registerDocumentFormattingEditProvider(id, provider);
		}
		return _registerDocumentFormattingEditProvider("html", formattingEditProvider);
	};

	disposables.push(
		monaco.languages.registerDocumentFormattingEditProvider(
			"javascript",
			formattingEditProvider
		)
	);

	disposables.push(
		monaco.languages.registerDocumentFormattingEditProvider(
			"typescript",
			formattingEditProvider
		)
	);

	return {
		dispose() {
			disposables.forEach((disposable: any) => disposable.dispose());
			if (prettierWorker) {
				prettierWorker.terminate();
			}
		},
	};
}

function registerSyntaxHighlighter(editor: ICodeEditor, monaco: Monaco) {
	const { worker: syntaxWorker } = createWorkerQueue(
		new Worker(new URL("../../workers/syntax-highlight.worker.js", import.meta.url))
	);

	const code = editor.getValue();

	const title = "script.js";
	const version = editor.getModel()?.getVersionId();

	syntaxWorker.postMessage({
		code,
		title,
		version,
	});

	syntaxWorker.addEventListener("message", (event: any) => {
		const { classifications } = event.data;

		requestAnimationFrame(() => {
			const oldDecor: any = editor.getModel()?.getAllDecorations();
			const decorations = classifications.map((classification: any) => ({
				range: new monaco.Range(
					classification.startLine,
					classification.start,
					classification.endLine,
					classification.end
				),
				options: {
					inlineClassName: classification.type
						? `${classification.kind} ${classification.type}-of-${classification.parentKind}`
						: classification.kind,
				},
			}));

			editor.deltaDecorations(oldDecor, decorations);
		});
	});
}

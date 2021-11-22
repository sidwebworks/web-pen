import { createWorkerQueue } from "../../../workers";

export function registerDocumentPrettier(editor, monaco) {
	const disposables = [];
	let prettierWorker;

	const formattingEditProvider = {
		async provideDocumentFormattingEdits(model, _options, _token) {
			if (!prettierWorker) {
				prettierWorker = createWorkerQueue(
					new Worker(new URL("../../../workers/prettier.worker.js", import.meta.url))
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

	disposables.push(
		monaco.languages.registerDocumentFormattingEditProvider(
			"javascript",
			formattingEditProvider
		)
	);

	disposables.push(
		monaco.languages.registerDocumentFormattingEditProvider("html", formattingEditProvider)
	);

	disposables.push(
		monaco.languages.registerDocumentFormattingEditProvider("css", formattingEditProvider)
	);
	disposables.push(
		monaco.languages.registerDocumentFormattingEditProvider(
			"typescript",
			formattingEditProvider
		)
	);

	return {
		dispose() {
			disposables.forEach((disposable) => disposable.dispose());
			if (prettierWorker) {
				prettierWorker.terminate();
			}
		},
	};
}

import { createWorkerQueue } from "../../../workers";

export function registerSyntaxHighlighter(editor, monaco) {
	const { worker: syntaxWorker } = createWorkerQueue(
		new Worker(new URL("../../../workers/syntax-highlight.worker.js", import.meta.url))
	);

	const colorize = () => {
		const title = "app.js";
		const model = editor.getModel();
		const version = model?.getVersionId();
		const lang = model._languageIdentifier.language;

		if (lang === "javascript") {
			const code = editor.getValue();
			syntaxWorker.postMessage({
				code,
				title,
				version,
			});
		}
	};

	editor.onDidChangeModel(colorize);

	editor.onDidChangeModelContent(colorize);

	syntaxWorker.addEventListener("message", (event) => {
		const { classifications } = event.data;

		requestAnimationFrame(() => {
			const oldDecor = editor.getModel()?.getAllDecorations();
			const decorations = classifications.map((classification) => ({
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

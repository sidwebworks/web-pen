import { IDisposable, MonacoPlugin } from "@typings/editor";
import type { editor } from "monaco-editor";
import { createWorkerQueue } from ".";

const plugin: MonacoPlugin = (editor, monaco) => {
  const disposables: IDisposable[] = [];

  let worker;

  const formattingEditProvider = {
    async provideDocumentFormattingEdits(
      model: editor.ITextModel,
      _options,
      _token
    ) {
      if (!worker) {
        worker = createWorkerQueue(
          new Worker(
            new URL("../../../../workers/prettier.worker.js", import.meta.url)
          )
        );
      }

      const { canceled, error, pretty } = await worker?.emit({
        text: model.getValue(),
        language: model.getLanguageId(),
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
    monaco.languages.registerDocumentFormattingEditProvider(
      "html",
      formattingEditProvider
    )
  );

  disposables.push(
    monaco.languages.registerDocumentFormattingEditProvider(
      "css",
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
      disposables.forEach((disposable) => disposable.dispose());
      if (worker) {
        worker.terminate();
      }
    },
  };
};

export default plugin;

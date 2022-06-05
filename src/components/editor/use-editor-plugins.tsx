import { useEditorModels } from "@hooks/use-editor-models";
import { Monaco } from "@monaco-editor/react";
import { ICodeEditor, IDisposable } from "@typings/types";
import { MutableRefObject, useEffect } from "react";
import { useTypedSelector } from "src/utils/store/store";
import emmetPlugin from "./plugins/emmet.plugin";
import prettierPlugin from "./plugins/prettier.plugin";

export const useEditorPlugins = (
  editor: MutableRefObject<ICodeEditor | null>,
  monaco: MutableRefObject<Monaco | null>
) => {
  const tabs = useTypedSelector((s) => s.editor.tabs);
  const models = useEditorModels();

  useEffect(() => {
    if (!editor.current) return;

    const active = Object.values(tabs).find((tab) => tab.isActive);

    if (active) {
      editor.current.setModel(models[active.path]);
    }
  }, [models, tabs, editor]);

  useEffect(() => {
    if (!editor.current || !monaco.current) return;

    const disposables: IDisposable[] = [];

    disposables.push(emmetPlugin(editor.current, monaco.current));

    disposables.push(prettierPlugin(editor.current, monaco.current));

    return () => {
      disposables.forEach((d) => d.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco, models]);
};

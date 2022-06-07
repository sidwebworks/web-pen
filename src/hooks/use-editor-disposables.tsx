import { useBundler } from "@hooks/use-bundler";
import { useEditor } from "@hooks/use-editor";
import { IDisposable, TextModel } from "@typings/editor";
import { debounce } from "lodash-es";
import router from "next/router";
import { useCallback, useEffect } from "react";
import { CLOSE_ACTIVE_TAB } from "src/lib/store/slices/editor";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import { SAVE_FILES } from "src/lib/store/thunks";
import emmetPlugin from "../components/editor/plugins/emmet.plugin";
import prettierPlugin from "../components/editor/plugins/prettier.plugin";
import textmatePlugin from "../components/editor/plugins/texmate.plugin";

export const useEditorDisposables = () => {
  const { editor, monaco } = useEditor();
  const tabs = useTypedSelector((s) => s.editor.tabs);
  const dispatch = useTypedDispatch();

  const { build } = useBundler();

  const onDisposeModel = useCallback(
    (model: TextModel) => {
      const tab = Object.values(tabs).find((t) => t.path === model.uri.path);

      if (tab) {
        dispatch(CLOSE_ACTIVE_TAB({ path: tab.path, id: tab.id }));
      }
    },
    [tabs, dispatch]
  );

  useEffect(() => {
    if (!editor || !monaco) return;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (router.query?.pid) {
        const models = monaco.editor.getModels().reduce((acc, curr) => {
          acc[curr.uri.path] = curr;
          return acc;
        }, {});

        dispatch(SAVE_FILES({ models, key: router.query.pid as string }));
      }

      build();
    });
  }, [editor, monaco, dispatch, build]);

  useEffect(() => {
    if (monaco && editor) {
      textmatePlugin(editor, monaco);
    }
  }, [monaco, editor]);

  useEffect(() => {
    if (!editor || !monaco) return;

    const disposables: IDisposable[] = [];

    disposables.push(emmetPlugin(editor, monaco));

    disposables.push(
      editor.onDidChangeModelContent(debounce(() => build(false), 500))
    );

    disposables.push(monaco.editor.onWillDisposeModel(onDisposeModel));

    disposables.push(prettierPlugin(editor, monaco));

    return () => {
      disposables.forEach((d) => d.dispose());
    };
  }, [monaco, editor, build, onDisposeModel]);
};

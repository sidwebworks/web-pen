import { useBundler } from "@hooks/use-bundler";
import { useEditor } from "@hooks/use-editor";
import { nanoid } from "@reduxjs/toolkit";
import { IDisposable, TextModel } from "@typings/editor";
import { debounce } from "lodash-es";
import { useRouter } from "next/router";
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
  const router = useRouter();
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

  const command = useCallback(async () => {
    let id = router.query?.pid as string;

    if (!id) {
      id = nanoid();
      const url = `/editor/${id}`;
      await router.push(url, url);
    }

    const models = monaco.editor.getModels().reduce((acc, curr) => {
      acc[curr.uri.path] = curr;
      return acc;
    }, {});

    await dispatch(SAVE_FILES({ models, key: id }));

    build(true);
  }, [router, monaco, build]);

  useEffect(() => {
    if (!editor || !monaco) return;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, command);
  }, [editor, monaco]);

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

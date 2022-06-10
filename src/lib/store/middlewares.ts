import { loader, Monaco } from "@monaco-editor/react";
import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { TextModel } from "@typings/editor";
import { isFile } from "@typings/guards";
import { getLanguage } from "../fs/filesystem";
import { SET_ACTIVE_TAB } from "./slices/editor";
import { AppDispatch } from "./store";
import { FETCH_THEMES, LOAD_INITIAL_FILES } from "./thunks";

export const editorMiddleware: Middleware = (store) => (next) => {
  let monaco: Monaco | null = null;
  let registered: Record<string, TextModel> = {};

  const dispatch = store.dispatch as AppDispatch;

  return async (action: PayloadAction) => {
    if (LOAD_INITIAL_FILES.pending.match(action)) {
      Object.values(registered).forEach((d) => d.dispose());
      registered = {};
    }

    if (LOAD_INITIAL_FILES.fulfilled.match(action)) {
      if (!monaco) {
        monaco = await loader.init();
      }

      dispatch(FETCH_THEMES());

      const files = store.getState().editor.dir.children;

      for (let file of files) {
        if (!isFile(file)) return;

        if (registered[file.id]) {
          registered[file.id].dispose();
        }

        const model = monaco.editor.createModel(
          file.content,
          getLanguage(file.name),
          monaco.Uri.parse(file.path)
        );

        registered[file.id] = model;
      }

      const file = files.find((e) => e.name.startsWith("app")) || files[0];

      dispatch(SET_ACTIVE_TAB({ id: file.id, path: file.path }));
    }

    next(action);
  };
};

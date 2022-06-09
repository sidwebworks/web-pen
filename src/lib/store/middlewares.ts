import { loader, Monaco } from "@monaco-editor/react";
import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { isFile } from "@typings/guards";
import { getLanguage } from "../fs/filesystem";
import { AppDispatch } from "./store";
import { FETCH_THEMES, LOAD_INITIAL_FILES } from "./thunks";

export const editorMiddleware: Middleware = (store) => (next) => {
  let monaco: Monaco | null = null;
  let registered = [];

  const dispatch = store.dispatch as AppDispatch;

  return async (action: PayloadAction) => {
    if (LOAD_INITIAL_FILES.pending.match(action)) {
      monaco = await loader.init();
      monaco.editor.getModels().forEach((m) => m.dispose());
      registered = [];
    }

    if (LOAD_INITIAL_FILES.fulfilled.match(action)) {
      dispatch(FETCH_THEMES());

      if (!monaco) {
        monaco = await loader.init();
      }

      const files = store.getState().editor.dir.children;

      for (let file of files) {
        if (!isFile(file) || registered.includes(file.id)) return;

        monaco.editor.createModel(
          file.content,
          getLanguage(file.name),
          monaco.Uri.parse(file.path)
        );

        registered.push(file.id);
      }
    }

    next(action);
  };
};

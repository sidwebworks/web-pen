import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { editor } from "monaco-editor";

type IEditorState = {
  tabs: Record<string, { isActive: boolean; path: string; id: string }>;
  options: editor.IStandaloneDiffEditorConstructionOptions;
};

const initialState: IEditorState = {
  tabs: {},
  options: {
    scrollbar: { verticalScrollbarSize: 10 },
    minimap: { enabled: false },
    fontSize: 15,
    lineNumbers: "off",
    cursorStyle: "block-outline",
    guides: { bracketPairs: true, indentation: true },
    wordWrap: "off",
    cursorSmoothCaretAnimation: true,
    scrollBeyondLastLine: false,
    padding: { top: 10, bottom: 10 },
    theme: "dark",
  },
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    SET_ACTIVE_TAB(
      state,
      { payload }: PayloadAction<{ path: string; id: string }>
    ) {
      // Set all tabs to inactive first
      Object.entries(state.tabs).forEach(([_, tab]) => (tab.isActive = false));

      console.log(payload);
      // Set current tab as active
      state.tabs[payload.id] = {
        id: payload.id,
        isActive: true,
        path: payload.path,
      };
    },
    CLOSE_ACTIVE_TAB(
      state,
      { payload }: PayloadAction<{ path: string; id: string }>
    ) {
      delete state.tabs[payload.id];

      Object.entries(state.tabs).forEach(([_, tab]) => (tab.isActive = false));

      // Set the next tab in the stack as active
      const next = Object.entries(state.tabs).at(-1);

      if (next) {
        next[1].isActive = true;
      }
    },
  },
});

export const { SET_ACTIVE_TAB, CLOSE_ACTIVE_TAB } = slice.actions;

export default slice;

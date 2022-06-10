import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Directory, DirectoryTypes, Selectable } from "@typings/editor";
import type { editor } from "monaco-editor";
import { createDirectory } from "src/lib/fs/filesystem";
import { FETCH_THEMES, LOAD_THEME } from "../thunks";

type IEditorState = {
  tabs: Record<string, { isActive: boolean; path: string; id: string }>;
  dir: Directory;
  themes: { label: string; value: string }[];
  options: editor.IStandaloneEditorConstructionOptions;
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  currentTheme: Selectable<string>;
};

const initialState: IEditorState = {
  isSidebarOpen: true,
  isSettingsOpen: false,
  themes: [],
  currentTheme: {
    value: "night-owl",
    label: "Night owl",
  },
  tabs: {},
  dir: createDirectory({
    children: [],
    isOpen: true,
    name: "root",
    parent: "/",
    type: DirectoryTypes.DEFAULT,
  }),
  options: {
    scrollbar: { verticalScrollbarSize: 10 },
    minimap: { enabled: false },
    fontSize: 15,
    lineNumbers: "on",
    bracketPairColorization: { enabled: true },
    fixedOverflowWidgets: true,
    renderLineHighlight: "all",
    cursorStyle: "block",
    cursorBlinking: "phase",
    formatOnPaste: true,
    detectIndentation: true,
    insertSpaces: false,
    guides: {
      bracketPairs: false,
      indentation: true,
      highlightActiveIndentation: true,
      highlightActiveBracketPair: true,
    },
    wordWrap: "off",
    cursorSmoothCaretAnimation: true,
    scrollBeyondLastLine: false,
    padding: { top: 10, bottom: 10 },
    theme: "night-owl",
  },
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    TOGGLE_SIDEBAR(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    TOGGLE_SETTINGS(state, action: PayloadAction<boolean | undefined>) {
      state.isSettingsOpen = action.payload ?? !state.isSettingsOpen;
    },
    UPDATE_ROOT_DIR(state, action: PayloadAction<Directory>) {
      state.dir = action.payload;
    },
    SET_ACTIVE_TAB(
      state,
      { payload }: PayloadAction<{ path: string; id: string }>
    ) {
      // Set all tabs to inactive first
      Object.entries(state.tabs).forEach(([_, tab]) => (tab.isActive = false));

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
    CLOSE_ALL_TABS(state) {
      state.tabs = {};
    },
    UPDATE_OPTIONS(
      state,
      action: PayloadAction<editor.IStandaloneEditorConstructionOptions>
    ) {
      state.options = Object.assign({}, state.options, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(FETCH_THEMES.fulfilled, (state, { payload }) => {
      state.themes = payload;
    });
    builder.addCase(LOAD_THEME.fulfilled, (state, { meta }) => {
      state.currentTheme = meta.arg;
    });
  },
});

export const {
  SET_ACTIVE_TAB,
  CLOSE_ACTIVE_TAB,
  TOGGLE_SIDEBAR,
  CLOSE_ALL_TABS,
  UPDATE_ROOT_DIR,
  TOGGLE_SETTINGS,
  UPDATE_OPTIONS,
} = slice.actions;

export default slice;

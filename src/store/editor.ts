import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { editor } from "monaco-editor";
import { createStorage } from "./helpers";

type EditionOptions = editor.IStandaloneDiffEditorConstructionOptions;

const fileCache = createStorage("_EDITOR_FILES_");

export const filesAtom = atomWithStorage(
  "_EDITOR_FILES_",
  {},
  {
    getItem: fileCache.getItem,
    setItem: fileCache.setItem,
    removeItem: fileCache.removeItem,
  }
);

export const optionsAtom = atomWithStorage<EditionOptions>(
  "_EDITOR_SETTINGS_",
  {
    scrollbar: { verticalScrollbarSize: 10 },
    minimap: { enabled: false },
    fontSize: 15,
    lineNumbers: "off",
    cursorStyle: "block-outline",
    guides: { bracketPairs: false, indentation: false },
    wordWrap: "on",
    cursorSmoothCaretAnimation: true,
    scrollBeyondLastLine: false,
    padding: { top: 10, bottom: 10 },
    theme: "vs-dark",
  }
);

export const modelsAtom = atom<Record<string, editor.ITextModel>>({});

export const activeTabs = atom<Record<string, boolean>>({});

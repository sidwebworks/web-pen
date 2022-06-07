import { Monaco } from "@monaco-editor/react";
import type monaco from "monaco-editor";

export type ICodeEditor = monaco.editor.IStandaloneCodeEditor;

export type IEditorSettings =
  monaco.editor.IStandaloneEditorConstructionOptions;

export type IDisposable = monaco.IDisposable;

export enum DirectoryTypes {
  DEFAULT = 1,
  HIDDEN = 0,
}

export type TextModel = monaco.editor.ITextModel;

export type EditorLanguages =
  | "javascript"
  | "html"
  | "css"
  | "typescript"
  | "markdown"
  | "text";

export type CompilerOptions = monaco.languages.typescript.CompilerOptions;

export type MonacoPlugin = (
  editor: ICodeEditor,
  monaco: Monaco
) => {
  dispose: () => void;
};

type Item = {
  id: string;
  path: string;
  parent?: string;
  name: string;
  createdAt: string;
};

export type File = Item & {
  content: string;
  mimeType: string;
};

export type Directory = Item & {
  type: DirectoryTypes;
  children: (File | Directory)[];
  isOpen: boolean;
};

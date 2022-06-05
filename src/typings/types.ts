import { Monaco } from "@monaco-editor/react";
import type monaco from "monaco-editor";
import { MutableRefObject } from "react";

export type ICodeEditor = monaco.editor.IStandaloneCodeEditor;
export type EditorSettings = monaco.editor.IStandaloneEditorConstructionOptions;

export type IDisposable = monaco.IDisposable;

export enum DirectoryTypes {
  DEFAULT = 1,
  HIDDEN = 0,
}

export type MonacoModel = monaco.editor.ITextModel;

export type EditorLanguages =
  | "javascript"
  | "html"
  | "css"
  | "typescript"
  | "markdown"
  | "text";

export type Methods =
  | "log"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "table"
  | "clear"
  | "time"
  | "timeEnd"
  | "count"
  | "assert";

export interface ConsoleLog {
  method: Methods;
  data: any[];
  id?: string;
}

export type BundleOutput =
  | {
      code: string;
      err: null;
    }
  | {
      code: string;
      err: {
        method: string;
        data: any[];
        id: string;
      };
    };

export type MonacoOptions = monaco.editor.IStandaloneEditorConstructionOptions;

export type CompilerOptions = monaco.languages.typescript.CompilerOptions;

export type MonacoPlugin = (
  editor: ICodeEditor,
  monaco: Monaco
) => {
  dispose: () => void;
};

import { Monaco } from "@monaco-editor/react";
import { ICodeEditor } from "@typings/editor";
import {
  createContext,
  Dispatch,
  FC,
  useContext,
  useMemo,
  useState,
} from "react";

type IEditorState = {
  monaco: Monaco | null;
  editor: ICodeEditor | null;
  update: Dispatch<Omit<IEditorState, "update">>;
};

const EditorContext = createContext<IEditorState>(null);

export const EditorProvider: FC = ({ children }) => {
  const [state, setState] = useState({
    editor: null,
    monaco: null,
  });

  const ctx = useMemo<IEditorState>(
    () => ({ ...state, update: setState }),
    [state]
  );

  return (
    <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const value = useContext(EditorContext);

  if (!value && value === null) {
    throw new Error("useEditor must be wrapped inside EditorContextProvider");
  }

  return value;
};

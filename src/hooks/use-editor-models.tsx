import { useMonaco } from "@monaco-editor/react";
import type { editor, IDisposable } from "monaco-editor";
import {
  createContext,
  FC,
  ReactChild,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type IEditorModels = Record<string, editor.ITextModel>;

const EditorModelsContext = createContext<IEditorModels>({});

export const EditorModelsProvider: FC<{ children: ReactChild }> = ({
  children,
}) => {
  const monaco = useMonaco();
  const [models, setModels] = useState<IEditorModels>({});

  useEffect(() => {
    if (!monaco) return;

    const disposables: IDisposable[] = [];

    disposables.push(
      monaco.editor.onDidCreateModel((e) => {
        setModels((p) => ({ ...p, [e.uri.path]: e }));
      })
    );

    disposables.push(
      monaco.editor.onWillDisposeModel((e) => {
        setModels((p) => {
          delete p[e.uri.path];
          return { ...p };
        });
      })
    );

    return () => {
      disposables.forEach((d) => d.dispose());
    };
  }, [monaco]);

  return (
    <EditorModelsContext.Provider value={models}>
      {children}
    </EditorModelsContext.Provider>
  );
};

export const useEditorModels = () => useContext(EditorModelsContext);

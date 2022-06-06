import { useMonaco } from "@monaco-editor/react";
import type { editor, IDisposable } from "monaco-editor";
import {
  createContext,
  FC,
  ReactChild,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CLOSE_ACTIVE_TAB } from "src/lib/store/slices/editor";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";

type IEditorModels = Record<string, editor.ITextModel>;

const EditorModelsContext = createContext<IEditorModels>({});

export const EditorModelsProvider: FC<{ children: ReactChild }> = ({
  children,
}) => {
  const monaco = useMonaco();
  const [models, setModels] = useState<IEditorModels>({});
  const tabs = useTypedSelector((s) => s.editor.tabs);
  const dispatch = useTypedDispatch();

  const closeActiveTab = useCallback(
    (uri: string) => {
      const tab = Object.values(tabs).find((t) => t.path === uri);
      console.log(tab, tabs);

      if (tab) {
        dispatch(CLOSE_ACTIVE_TAB({ path: tab.path, id: tab.id }));
      }
    },
    [tabs, dispatch]
  );

  useEffect(() => {
    if (!monaco) return;

    const disposables: IDisposable[] = [];

    disposables.push(
      monaco.editor.onDidCreateModel((e) => {
        setModels((p) => ({ ...p, [e.uri.path]: e }));
      })
    );

    disposables.push(
      monaco.editor.onDidChangeModelLanguage((e) => {
        setModels((p) => ({ ...p, [e.model.uri.path]: e.model }));
      })
    );

    disposables.push(
      monaco.editor.onWillDisposeModel((e) => {
        closeActiveTab(e.uri.path);
        setModels((p) => {
          delete p[e.uri.path];
          return { ...p };
        });
      })
    );

    return () => {
      disposables.forEach((d) => d.dispose());
    };
  }, [monaco, closeActiveTab]);

  return (
    <EditorModelsContext.Provider value={models}>
      {children}
    </EditorModelsContext.Provider>
  );
};

export const useEditorModels = () => useContext(EditorModelsContext);

import { useEditor } from "@hooks/use-editor";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import React from "react";
import { useTypedSelector } from "../../lib/store/store";
import { onBeforeEditorMount } from "./plugins";
import theme from "./themes/night_owl.json";

const Editor: React.FC = () => {
  const options = useTypedSelector((s) => s.editor.options);
  const { update } = useEditor();

  const handleMount: OnMount = (editor, monaco) => {
    editor.onDidChangeModel(() => {
      editor.getAction("editor.action.formatDocument").run();
    });

    editor.setModel(null);

    monaco.editor.defineTheme("dark", theme as any);

    monaco.editor.setTheme("dark");

    update({ monaco, editor });
  };

  return (
    <MonacoEditor
      beforeMount={onBeforeEditorMount}
      onMount={handleMount}
      options={options}
      saveViewState={true}
      theme="dark"
      className="h-full min-h-full overflow-clip relative inset-0"
      loading={<h3 className="font-medium text-cyan-500">Booting Up...</h3>}
    />
  );
};

export default Editor;

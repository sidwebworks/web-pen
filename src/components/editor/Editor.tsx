import { useEditor } from "@hooks/use-editor";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import React, { Fragment } from "react";
import { onBeforeEditorMount } from "../../lib/monaco/plugins";
import theme from "../../lib/monaco/themes/night-owl.json";
import { useTypedSelector } from "../../lib/store/store";


const Editor: React.FC = () => {
  const options = useTypedSelector((s) => s.editor.options);
  const { update } = useEditor();

  const handleMount: OnMount = (editor, monaco) => {
    editor.onDidChangeModel(() => {
      editor.getAction("editor.action.formatDocument").run();
    });

    editor.setModel(null);

    monaco.editor.defineTheme("night-owl", theme as any);

    monaco.editor.setTheme("night-owl");

    update({ monaco, editor });
  };

  return (
    <Fragment>
      <MonacoEditor
        beforeMount={onBeforeEditorMount}
        onMount={handleMount}
        options={options}
        saveViewState={true}
        theme="night-owl"
        className="h-full min-h-full overflow-clip relative inset-0"
        loading={""}
      />
    </Fragment>
  );
};

export default Editor;

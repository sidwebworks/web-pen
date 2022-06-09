import { useEditor } from "@hooks/use-editor";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import React, { Fragment, useMemo } from "react";
import { useTypedSelector } from "../../lib/store/store";
import { onBeforeEditorMount } from "../../lib/monaco/plugins";
import theme from "../../lib/monaco/themes/night_owl.json";
import WelcomeScreen from "./WelcomeScreen";

const Editor: React.FC = () => {
  const options = useTypedSelector((s) => s.editor.options);
  const tabs = useTypedSelector((s) => s.editor.tabs);
  const { update } = useEditor();

  const isOpen = useMemo(
    () => (Object.keys(tabs).length ? true : false),
    [tabs]
  );

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
      {!isOpen && <WelcomeScreen />}
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

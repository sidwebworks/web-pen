import { useBundler } from "@hooks/use-bundler";
import { useEditorModels } from "@hooks/use-editor-models";
import { useFileSystem } from "@hooks/use-filesystem";
import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import { ICodeEditor } from "@typings/types";
import { debounce } from "lodash-es";
import React, { useCallback, useEffect, useRef } from "react";
import { getLanguage } from "src/utils";
import { useTypedSelector } from "../../utils/store/store";
import { onBeforeEditorMount } from "./plugins";
import textmate from "./plugins/texmate.plugin";
import theme from "./themes/night_owl.json";
import { useEditorPlugins } from "./use-editor-plugins";

const Editor: React.FC<{ onMount: OnMount }> = ({ onMount }) => {
  const options = useTypedSelector((s) => s.editor.options);
  const fs = useFileSystem();
  const models = useEditorModels();
  const tabs = useTypedSelector((s) => s.editor.tabs);
  const initial = useRef(true);
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<ICodeEditor | null>(null);
  const { build } = useBundler();

  useEditorPlugins(editorRef, monacoRef);

  useEffect(() => {
    if (!editorRef.current) return;

    const active = Object.values(tabs).find((el) => el.isActive);

    if (active && models[active.path]) {
      editorRef.current.setModel(models[active.path]);
    }
  }, [tabs, models]);

  const handleMount: OnMount = useCallback(async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("dark", theme as any);

    monaco.editor.setTheme("dark");

    editor.setModel(null);

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction("editor.action.formatDocument").run();
      build();
    });

    monaco.editor.onDidCreateModel(
      debounce(() => {
        if (!initial.current) return;
        initial.current = false;
        build();
      }, 250)
    );

    const files = fs.getFiles();

    for (let file of files) {
      if (file.path in models) return;

      monaco.editor.createModel(
        file.content,
        getLanguage(file.name),
        monaco.Uri.file(file.path)
      );
    }

    onMount(editor, monaco);

    textmate(editor, monaco);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MonacoEditor
      beforeMount={onBeforeEditorMount}
      onMount={handleMount}
      options={options}
      saveViewState={true}
      theme="dark"
      className="h-full min-h-full relative inset-0"
      loading={<h3 className="font-medium text-cyan-500">Booting Up...</h3>}
    />
  );
};

export default Editor;

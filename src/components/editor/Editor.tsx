import { Listbox } from "@headlessui/react";
import MonacoEditor, {
  BeforeMount,
  Monaco,
  OnMount,
} from "@monaco-editor/react";
import { useAtom, useAtomValue } from "jotai";
import { debounce } from "lodash-es";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { activeTabs, modelsAtom, optionsAtom } from "../../store/editor";
import { ICodeEditor } from "../../utils/typings/types";
import { FileSystem, getLanguage } from "../file-tree";

const fs = FileSystem.getInstance();

const Editor: React.FC = () => {
  const editorRef = useRef<ICodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [models, setModels] = useAtom(modelsAtom);
  const options = useAtomValue(optionsAtom);
  const tabs = useAtomValue(activeTabs);

  const active = useMemo(() => Object.keys(tabs).find((k) => tabs[k]), [tabs]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setModel(models[active!]);
    }
  }, [active, models]);

  const onBeforeMount: BeforeMount = useCallback((monaco) => {
    const files = fs.getFiles();
    const _models = {};

    for (let file of files) {
      if (file.path in models) return;
      _models[file.path] = monaco.editor.createModel(
        file.content,
        getLanguage(file.name),
        monaco.Uri.parse(file.path)
      );
    }

    setModels(_models);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.setModel(null);
  }, []);

  return (
    <MonacoEditor
      beforeMount={onBeforeMount}
      onMount={onMount}
      options={options}
      saveViewState={true}
      theme="vs-dark"
      className="relative w-full overflow-clip h-auto min-h-[100vh-6vh] inset-0"
      loading={<h3 className="font-medium text-cyan-500">Booting Up...</h3>}
    />
  );
};

const LangSwitcher = ({ file }: any) => {
  const formats = [
    { id: 1, name: "Javascript", extension: ".jsx" },
    { id: 2, name: "Typescript", extension: ".tsx" },
  ];

  const [selectedLang, setSelectedLang] = useState(() =>
    formats.find((e) => e.extension === "." + file.name.split(".")[1])
  );

  const onLangChange = (e: any) => {
    setSelectedLang(e);
  };
  return (
    <div className="absolute right-0 z-20 bg-transparent bottom-0.5 pb-[0.2rem] text-cyan-400  mr-3">
      <Listbox value={selectedLang} onChange={onLangChange}>
        <Listbox.Options className="flex flex-col py-2 space-y-2 text-xs bg-gray-900 rounded-md text-cyan-400">
          {formats.map((lang) => (
            <Listbox.Option
              key={lang.id}
              className="pl-2 pr-4 text-right cursor-pointer "
              value={lang}
            >
              {({ active, selected }) => (
                <span
                  className={`${
                    active
                      ? "text-cyan-500 "
                      : lang.id === selectedLang?.id
                      ? "text-cyan-500"
                      : "text-gray-600"
                  }`}
                >
                  {lang.name}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
        <Listbox.Button className="pl-5 pr-4 text-xs">
          {" "}
          {selectedLang?.name}{" "}
        </Listbox.Button>
      </Listbox>
    </div>
  );
};

export default Editor;

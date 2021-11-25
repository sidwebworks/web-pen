import { Listbox } from "@headlessui/react";
import MonacoEditor, { OnChange, OnMount } from "@monaco-editor/react";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import { SWITCH_LANG, UPDATE_CODE } from "../../redux/actions/editor.actions";
import { debounce } from "../../utils";
import { useTypedSelector } from "../../utils/hooks/use-actions";
import { useEffectAfterMount } from "../../utils/hooks/use-effect-aftermount";
import { MonacoConfig } from "../../utils/monaco";
import { initEditor, initMonaco } from "../../utils/monaco/register";
import { ICodeEditor } from "../../utils/typings/types";
import { HeaderPanel } from "./Header";

const Editor: React.FC = () => {
	const instance = useRef<{ editor: ICodeEditor; format: any } | null>(null);
	const activeModel = useRef<any>();
	const dispatch = useDispatch();

	const active_file = useTypedSelector<any>((s) => s.editor.active_file);

	const code = useTypedSelector<string>((s) => s.editor.files[active_file.type].value);

	useEffectAfterMount(() => {
		if (active_file.type === "script") {
			let timer: NodeJS.Timeout;
			let promise;
			timer = setTimeout(() => {
				promise = dispatch(CREATE_BUNDLE());
			}, 750);

			return () => {
				promise?.abort();
				clearTimeout(timer);
			};
		}
	}, [code]);

	const onEditorDidMount: OnMount = (editor: ICodeEditor, monaco) => {
		const format = editor.getAction("editor.action.formatDocument");
		instance.current = { editor, format };

		activeModel.current = editor.getModel();

		initEditor(editor, monaco);

		editor.onDidChangeModel((e) => {
			const uri = e.newModelUrl;
			if (uri) {
				const model = monaco.editor.getModel(uri);
			}
		});

		editor.onDidChangeModelContent(() => debounce(() => editor.saveViewState(), 200));
	};

	const onChangeHandler = debounce<OnChange>((code) => {
		dispatch(UPDATE_CODE({ type: active_file.type, code: code || "" }));
	}, 50);

	const formatCode = useCallback(() => instance.current?.format.run(), [instance.current]);

	return (
		<main className="relative h-full min-h-screen border-r-2 border-gray-800">
			<HeaderPanel onFormat={formatCode} />
			<MonacoEditor
				beforeMount={initMonaco}
				onMount={onEditorDidMount}
				options={MonacoConfig}
				theme="ayu-dark"
				className="absolute inset-0 w-full h-full"
				path={"script.tsx"}
				value={code}
				onChange={onChangeHandler}
				language={active_file.lang}
				height={"100%"}
				loading={<h3 className="font-medium text-cyan-500">Booting Up...</h3>}
			/>
			{active_file.type === "script" && <LangSwitcher file={active_file} />}
		</main>
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
	const dispatch = useDispatch();

	const onLangChange = (e: any) => {
		setSelectedLang(e);
		dispatch(SWITCH_LANG({ ext: e.extension, lang: e.name.toLowerCase() }));
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
				<Listbox.Button className="pl-5 pr-4 text-xs"> {selectedLang?.name} </Listbox.Button>
			</Listbox>
		</div>
	);
};

export default Editor;

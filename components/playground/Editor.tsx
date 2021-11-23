import MonacoEditor, { OnChange, OnMount } from "@monaco-editor/react";
import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import { UPDATE_CODE } from "../../redux/actions/editor.actions";
import { debounce } from "../../utils";
import { useTypedSelector } from "../../utils/hooks/use-actions";
import { useEffectAfterMount } from "../../utils/hooks/use-effect-aftermount";
import { MonacoConfig } from "../../utils/monaco";
import { initEditor } from "../../utils/monaco/initEditor";
import { initMonaco } from "../../utils/monaco/initMonaco";
import { ICodeEditor } from "../../utils/typings/types";
import { FooterPanel } from "./Footer";
import { HeaderPanel } from "./Header";

const Editor: React.FC = () => {
	const instance = useRef<{ editor: ICodeEditor; format: any } | null>(null);
	const activeModel = useRef<any>();
	const dispatch = useDispatch();
	const active_file = useTypedSelector<any>((s) => s.editor.active_file);
	const code = useTypedSelector<string>((s) => s.editor.files[active_file.type].value);

	useEffectAfterMount(() => {
		if (active_file.name === "app.js") {
			let timer: NodeJS.Timeout;
			let promise;
			timer = setTimeout(() => {
				promise = dispatch(CREATE_BUNDLE());
			}, 600);

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
				activeModel.current = monaco.editor.getModel(uri);
			}
		});

		editor.onDidChangeModelContent(() => {
			debounce(() => editor.saveViewState(), 200);
		});
	};

	const onChangeHandler = debounce<OnChange>((code) => {
		dispatch(UPDATE_CODE({ type: active_file.type, code: code || "" }));
	}, 50);

	const formatCode = useCallback(() => instance.current?.format.run(), [instance.current]);

	return (
		<main className="h-full min-h-screen relative border-r-2 border-gray-800">
			<HeaderPanel onFormat={formatCode} />
			<MonacoEditor
				beforeMount={initMonaco}
				onMount={onEditorDidMount}
				options={MonacoConfig}
				theme="vs-dark"
				className="absolute inset-0 w-full h-full"
				path={active_file.name}
				defaultValue={code}
				onChange={onChangeHandler}
				language={active_file.lang}
				height={"100%"}
				loading={<h3 className="text-cyan-500 font-medium">Booting Up...</h3>}
			/>
			<FooterPanel />
		</main>
	);
};

export default Editor;

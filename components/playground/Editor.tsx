import MonacoEditor from "@monaco-editor/react";
import { OnMount } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import { UPDATE_CODE } from "../../redux/actions/editor.actions";
import { debounce } from "../../utils";
import { initMonaco, initWorkers, MonacoConfig } from "../../utils/monaco";
import { ICodeEditor } from "../../utils/typings/types";
import { FooterPanel } from "./Footer";
import { HeaderPanel } from "./Header";

let isInit = true;
const Editor: React.FC = () => {
	const instance = useRef<{ editor: ICodeEditor; format: any } | null>(null);
	const activeModel = useRef<any>();
	const dispatch = useDispatch();
	const active_file = useSelector<RootState, any>((s) => s.editor.active_file);
	console.log("active_file: ", active_file);

	const file = useSelector<RootState, any>((s) =>
		s.editor.files.find((e) => e.filename === active_file)
	);
	const javascript = useSelector<RootState, any>((s) =>
		s.editor.files.find((e) => e.language === "javascript")
	);

	useEffect(() => {
		if (isInit) {
			isInit = false;
			return;
		}
		const timer = setTimeout(() => {
			dispatch(CREATE_BUNDLE());
		}, 800);

		return () => clearTimeout(timer);
	}, [javascript]);

	const onEditorDidMount: OnMount = useCallback((editor: ICodeEditor, monaco) => {
		const format = editor.getAction("editor.action.formatDocument");

		instance.current = { editor, format };

		activeModel.current = editor.getModel();

		initWorkers(editor, monaco);

		editor.onDidChangeModel((e) => {
			const uri = e.newModelUrl;
			if (uri) {
				activeModel.current = monaco.editor.getModel(uri);
			}
		});

		editor.onDidChangeModelContent(() => {
			const model = activeModel.current;
			debounce(() => {
				if (model.editor?.saveViewState) {
					model.editor.saveViewState();
				}
			});
		});

		editor.onDidChangeModelContent(
			debounce(() => {
				const model = activeModel.current;
				const language = model._languageIdentifier.language;

				dispatch(UPDATE_CODE({ type: language, code: model.getValue() }));
			})
		);
	}, []);

	const formatCode = () => instance.current?.format.run();

	return (
		<main className="h-full min-h-screen relative border-r-2 border-gray-800">
			<HeaderPanel formatCode={formatCode} />
			<MonacoEditor
				beforeMount={initMonaco}
				onMount={onEditorDidMount}
				options={MonacoConfig}
				theme="vs-dark"
				className="absolute inset-0 w-full h-full"
				path={active_file}
				value={file.value}
				language={file.language}
				height={"100%"}
				loading={<h3 className="text-cyan-500 font-medium">Booting Up...</h3>}
			/>
			<FooterPanel />
		</main>
	);
};

export default Editor;

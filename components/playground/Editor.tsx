const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
});
import { OnMount } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import React, { useCallback, useRef } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { UPDATE_EDITOR } from "../../redux/actions/code.actions";
import { debounce } from "../../utils";
import { initMonaco, initWorkers, MonacoConfig } from "../../utils/monaco";
import { ICodeEditor } from "../../utils/typings/types";
import { HeaderPanel } from "./Header";

export const Editor: React.FC = () => {
	const instance = useRef<{ editor: ICodeEditor; format: any } | null>(null);
	const activeModel = useRef<any>();
	const dispatch = useDispatch();
	const active = useSelector<RootState, any>((s) => s.code.active_tab);
	const file = useSelector<RootState, any>((s) =>
		s.code.files.find((e) => e.filename === active)
	);

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

		editor.onDidChangeModelContent(
			debounce(() => {
				const model = activeModel.current;
				if (model) {
					model.editor.saveViewState();
				}
			}, 500)
		);

		editor.onDidChangeModelContent(() => {
			const model = activeModel.current;
			const language = model._languageIdentifier.language;

			dispatch(UPDATE_EDITOR({ type: language, code: model.getValue() }));
		});
	}, []);

	const formatCode = () => instance.current?.format.run();

	return (
		<>
			<HeaderPanel formatCode={formatCode} />
			<div className="editor-wrapper">
				<MonacoEditor
					beforeMount={initMonaco}
					onMount={onEditorDidMount}
					options={MonacoConfig}
					theme="vs-dark"
					path={active}
					value={file.value}
					language={file.language}
					loading={<Loader type="Grid" color="cyan" />}
					height="100vh"
				/>
			</div>
		</>
	);
};

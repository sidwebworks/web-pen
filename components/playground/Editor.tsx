const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
});
import { OnMount, useMonaco } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";
import Loader from "react-loader-spinner";
import { CodeEditorProps } from "../../typings/interfaces";
import { ICodeEditor } from "../../typings/types";
import { initMonaco, initWorkers, MonacoConfig } from "../../utils/monaco";

export const Editor: React.FC<CodeEditorProps> = ({ intialValue, onChange }) => {
	const editorRef = useRef<ICodeEditor | null>(null);

	const onEditorDidMount: OnMount = (editor: ICodeEditor, monaco) => {
		editorRef.current = editor;

		initWorkers(editor, monaco);

		editor.onDidChangeModelContent(() => {
			onChange(editor.getValue());
		});
	};

	return (
		<div className="editor-wrapper">
			<MonacoEditor
				value={intialValue}
				beforeMount={initMonaco}
				onMount={onEditorDidMount}
				options={MonacoConfig}
				language="javascript"
				theme="night-owl"
				loading={<Loader type="Grid" color="cyan" />}
				height="100%"
			/>
		</div>
	);
};

export const OptionsPanel = () => {
	const monaco = useMonaco();
	const format = useRef<any>();

	useEffect(() => {
		if (!monaco?.editor) return;
		if (!format.current) {
			monaco.editor.onDidCreateEditor((codeEditor) => {
				format.current = codeEditor.getAction("editor.action.formatDocument");
			});
		}
	}, [monaco]);

	const runFormat = () => format.current?.run();

	return (
		<div className="absolute top-0 right-0 z-20 flex justify-end flex-grow px-6 py-2 gap-x-5">
			<button onClick={runFormat} className="rounded-full btn btn-success" role="button">
				Format
			</button>
		</div>
	);
};

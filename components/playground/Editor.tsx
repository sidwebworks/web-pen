import load from "next/dynamic";
import React, { memo, useContext, useRef } from "react";

import { CodeBoxContext } from "../../pages";
import { CodeEditorProps } from "../../typings/interfaces";
import { ICodeEditor } from "../../typings/types";
import { MonacoConfig } from "../../utils/monaco";
import { initMonaco } from "../../utils/monaco/initialize";

const MonacoEditor = load(() => import("@monaco-editor/react"), {
	loading: () => <p>Booting up...</p>,
});

export const Editor: React.FC<CodeEditorProps> = ({ intialValue, onChange }) => {
	const editorRef = useRef<ICodeEditor | null>(null);

	const { setEditor } = useContext(CodeBoxContext);

	const onEditorDidMount = (editor: ICodeEditor) => {
		editorRef.current = editor;
		setEditor(editor);

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
				language="typescript"
				theme="vs-dark"
				height="100%"
			/>
		</div>
	);
};

export const OptionsPanel = () => {
	const { editor } = useContext(CodeBoxContext);

	const onFormatClick = () => {
		if (!editor) return;
		editor.getAction("editor.action.formatDocument").run();
	};

	return (
		<div className="absolute top-0 z-20 flex  justify-end right-0 flex-grow px-6 py-2 gap-x-5">
			<button
				onClick={onFormatClick}
				className="btn rounded-full  btn-warning"
				role="button"
				aria-pressed="true"
			>
				Format
			</button>
		</div>
	);
};

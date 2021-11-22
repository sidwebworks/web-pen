import { createReducer, nanoid } from "@reduxjs/toolkit";
import { defaultSnippets, MonacoConfig } from "../../utils/monaco";
import { Files, File, ConsoleLog, EditorSettings } from "../../utils/typings/types";

import {
	PRINT_CONSOLE,
	CLEAR_LOGS,
	UPDATE_CODE,
	SWITCH_FILE,
} from "../actions/editor.actions";

interface initState {
	files: File[];
	active_file: Files;
	console: ConsoleLog[];
	config: EditorSettings;
}

const initialState: initState = {
	files: [
		{
			value: defaultSnippets.html,
			filename: "index.html",
			language: "html",
			uri: null,
		},
		{
			value: defaultSnippets.css,
			filename: "styles.css",
			language: "css",
			uri: null,
		},
		{
			value: defaultSnippets.js,
			filename: "app.js",
			language: "javascript",
			uri: null,
		},
	],
	active_file: "index.html",
	config: MonacoConfig,
	console: [],
};

export const editorReducer = createReducer(initialState, (builder) => {
	builder.addCase(SWITCH_FILE, (state, action) => {
		state.active_file = action.payload;
	});

	builder.addCase(PRINT_CONSOLE, (state, action) => {
		const id = nanoid();
		state.console.push({ ...action.payload, id });
	});
	builder.addCase(CLEAR_LOGS, (state, action) => {
		state.console = [];
	});

	builder.addCase(UPDATE_CODE, (state, action) => {
		state.files.find((el) => {
			if (el.language === action.payload.type) {
				el.value = action.payload.code;
			}
		});
	});
});

import { createReducer, nanoid } from "@reduxjs/toolkit";
import { defaultSnippets, MonacoConfig } from "../../utils/monaco";
import {
	Files,
	File,
	ConsoleLog,
	EditorSettings,
	EditorLanguages,
} from "../../utils/typings/types";

import {
	PRINT_CONSOLE,
	CLEAR_LOGS,
	UPDATE_CODE,
	SWITCH_FILE,
} from "../actions/editor.actions";

interface initState {
	files: {
		[key: string]: File;
	};
	active_file: {
		name: Files;
		lang: EditorLanguages;
	};
	console: ConsoleLog[];
	config: EditorSettings;
}

const initialState: initState = {
	files: {
		html: {
			value: defaultSnippets.html,
			language: "html",
			filename: "index.html",
			uri: null,
		},
		css: {
			value: defaultSnippets.css,
			filename: "styles.css",
			language: "css",
			uri: null,
		},
		javascript: {
			value: defaultSnippets.js,
			filename: "app.js",
			language: "javascript",
			uri: null,
		},
	},
	active_file: {
		name: "app.js",
		lang: "javascript",
	},
	config: MonacoConfig,
	console: [],
};

export const editorReducer = createReducer(initialState, (builder) => {
	builder.addCase(SWITCH_FILE, (state, action) => {
		console.log('action: ', action);
		state.active_file = action.payload;
	});

	builder.addCase(PRINT_CONSOLE, (state, action) => {
		const id = nanoid();
		state.console.push({ ...action.payload, id });
	});
	builder.addCase(CLEAR_LOGS, (state) => {
		state.console = [];
	});

	builder.addCase(UPDATE_CODE, (state, action) => {
		state.files[action.payload.type].value = action.payload.code;
	});
});

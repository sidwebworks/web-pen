import { createReducer, nanoid } from "@reduxjs/toolkit";
import { defaultSnippets, MonacoConfig } from "../../utils/monaco";
import {
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
	SWITCH_LANG,
} from "../actions/editor.actions";

interface initState {
	files: {
		[key: string]: File;
	};
	active_file: {
		name: string;
		lang: EditorLanguages;
		type: "markup" | "script" | "styles";
	};
	console: ConsoleLog[];
	config: EditorSettings;
}

const initialState: initState = {
	files: {
		markup: {
			value: defaultSnippets.html,
			language: "html",
			filename: "index.html",
			uri: null,
		},
		styles: {
			value: defaultSnippets.css,
			filename: "styles.css",
			language: "css",
			uri: null,
		},
		script: {
			value: defaultSnippets.js,
			filename: "app.jsx",
			language: "javascript",
			uri: null,
		},
	},
	active_file: {
		name: "index.html",
		type: "markup",
		lang: "html",
	},
	config: MonacoConfig,
	console: [],
};

export const editorReducer = createReducer(initialState, (builder) => {
	builder.addCase(SWITCH_FILE, (state, action) => {
		state.active_file = action.payload;
	});
	builder.addCase(SWITCH_LANG, (state, action) => {
		const { ext, lang } = action.payload;
		const name = state.files.script.filename.split(".")[0];
		state.files.script.filename = `${name}${ext}`;
		state.files.script.language = lang;
		if (state.active_file.type === "script") {
			state.active_file.lang = lang;
			state.active_file.name = `${name}${ext}`;
		}
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

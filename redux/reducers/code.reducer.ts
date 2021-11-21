import { createReducer } from "@reduxjs/toolkit";

import {
	ADD_LOG,
	SWITCH_FILE,
	UPDATE_BUNDLE,
	UPDATE_EDITOR,
	UPDATE_ERROR,
} from "../actions/code.actions";

const defaultSnippets = {
	html: `<div id="root"></div>`,
	js: `import React from 'react';
	import ReactDOM from 'react-dom';
	import Select from 'react-select';
	
	const App = () => {
	  return (
		<>
		  {' '}
		  <h1>Hello React!</h1> <Select />{' '}
		</>
	  );
	};
	
	ReactDOM.render(<App />, document.querySelector('#root'));`,
	css: `body {
		background-color: red;
	  }
	  `,
};

const files = [
	{
		value: defaultSnippets.html,
		filename: "index.html",
		language: "html",
	},
	{
		value: defaultSnippets.css,
		filename: "styles.css",
		language: "css",
	},
	{
		value: defaultSnippets.js,
		filename: "app.js",
		language: "javascript",
	},
];

interface initState {
	files: typeof files;
	bundle: string;
	active_tab: string;
	error: null | string;
	loading: boolean;
	logs: any[];
}

const initialState: initState = {
	files,
	bundle: "",
	error: null,
	active_tab: "index.html",
	loading: false,
	logs: [{ method: "info", data: ["Welcome to Web PEN..."] }],
};

export const codeReducer = createReducer(initialState, (builder) => {
	builder.addCase(UPDATE_BUNDLE, (state, action) => {
		state.bundle = action.payload;
	});
	builder.addCase(SWITCH_FILE, (state, action) => {
		if (action.payload) {
			state.active_tab = action.payload;
		}
	});
	builder.addCase(UPDATE_ERROR, (state, action) => {
		state.error = action.payload;
	});
	builder.addCase(ADD_LOG, (state, action: { type: string; payload: any }) => {
		state.logs.push(action.payload);
	});
	builder.addCase(UPDATE_EDITOR, (state, action) => {
		if (action.payload) {
			state.files.find((el) => {
				if (el.language === action.payload.type) {
					el.value = action.payload.code;
				}
			});
		}
	});
});

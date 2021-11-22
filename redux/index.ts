import { configureStore } from "@reduxjs/toolkit";
import { bundlerReducer } from "./reducers/bundler.reducer";
import { editorReducer } from "./reducers/editor.reducer";

const store = configureStore({
	reducer: {
		editor: editorReducer,
		bundler: bundlerReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

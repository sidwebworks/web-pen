import { configureStore } from "@reduxjs/toolkit";
import { codeReducer } from "./reducers/code.reducer";

const store = configureStore({
	reducer: {
		code: codeReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

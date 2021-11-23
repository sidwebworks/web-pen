import { createReducer } from "@reduxjs/toolkit";
import { CREATE_BUNDLE } from "../actions/bundler.actions";

import { INIT_BUNDLER } from "../actions/bundler.actions";

interface initState {
	bundle: string;
	isBundling: boolean;
	initialized: boolean;
	hasError: boolean;
	error: null | string;
}

const initialState: initState = {
	bundle: "",
	isBundling: false,
	initialized: false,
	hasError: false,
	error: null,
};

export const bundlerReducer = createReducer(initialState, (builder) => {
	builder.addCase(INIT_BUNDLER, (state) => {
		state.initialized = true;
	});
	builder.addCase(CREATE_BUNDLE.fulfilled, (state, action) => {
		state.isBundling = false;
		state.hasError = false;
		state.error = null;
		state.bundle = action.payload.code;
	});
	builder.addCase(CREATE_BUNDLE.pending, (state, action) => {
		state.isBundling = true;
	});
	builder.addCase(CREATE_BUNDLE.rejected, (state, action) => {
		if (!action.meta.aborted) {
			state.isBundling = false;
			state.hasError = true;
			// @ts-ignore
			state.error = action.payload.data[0];
		}
	});
});

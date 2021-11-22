import { createReducer } from "@reduxjs/toolkit";
import { CREATE_BUNDLE } from "../actions/bundler.actions";

import { INIT_BUNDLER } from "../actions/bundler.actions";

interface initState {
	bundle: string;
	isBundling: boolean;
	initialized: boolean;
}

const initialState: initState = {
	bundle: "",
	isBundling: false,
	initialized: false,
};

export const bundlerReducer = createReducer(initialState, (builder) => {
	builder.addCase(INIT_BUNDLER, (state, action) => {
		state.initialized = true;
	});
	builder.addCase(CREATE_BUNDLE.fulfilled, (state, action) => {
		state.isBundling = false;
		state.bundle = action.payload.code;
	});
	builder.addCase(CREATE_BUNDLE.pending, (state, action) => {
		state.isBundling = true;
	});
});

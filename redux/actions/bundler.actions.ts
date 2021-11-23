import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import bundler from "../../utils/bundler";
import { BundleOutput } from "../../utils/typings/types";

export const INIT_BUNDLER = createAction("CODE.INIT_BUNDLER");

export const CREATE_BUNDLE = createAsyncThunk<BundleOutput, void, { state: RootState }>(
	"CREATE_BUNDLE",
	async (_, { getState }) => {
		const files = getState()?.editor.files;

		const unBundled = files.javascript.value || "";

		const result = await bundler(unBundled);

		return result;
	}
);

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import bundler from "../../utils/bundler";
import { BundleOutput } from "../../utils/typings/types";

export const INIT_BUNDLER = createAction("CODE.INIT_BUNDLER");

export const CREATE_BUNDLE = createAsyncThunk<BundleOutput, void, { state: RootState }>(
	"CREATE_BUNDLE",
	async (_, { getState, rejectWithValue }) => {
		const files = getState()?.editor.files;

		const unBundled = files.script.value || "";
		const lang: any = files.script.filename.split(".")[1] || "jsx";
		console.log('lang: ', lang);

		const result = await bundler(unBundled, lang);
		console.log('result: ', result);
		
		// If bundle gives an error,
		// reject and return the error message
		if (result.err) {
			return rejectWithValue(result.err);
		}

		return result;
	}
);

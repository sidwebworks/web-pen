import { createSlice } from "@reduxjs/toolkit";
import { BuildResult } from "esbuild-wasm";
import { BUNDLE_CODE, INIT_BUNDLER } from "../thunks";

type IBunderState = {
  isInitialized: boolean;
  isError: boolean;
  isBundling: boolean;
  errors: BuildResult["errors"];
  bundled: string;
};

const initialState: IBunderState = {
  isBundling: false,
  isError: false,
  isInitialized: false,
  errors: [],
  bundled: "",
};

const slice = createSlice({
  name: "bundler",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(INIT_BUNDLER.fulfilled, (state) => {
      state.isInitialized = true;
    });
    builder.addCase(BUNDLE_CODE.pending, (state) => {
      state.isError = false;
      state.isBundling = true;
    });
    builder.addCase(BUNDLE_CODE.fulfilled, (state, action) => {
      state.isBundling = false;
      state.bundled = action.payload;
    });
    builder.addCase(BUNDLE_CODE.rejected, (state) => {
      state.isBundling = false;
      state.isError = true;
    });
  },
});

export default slice;

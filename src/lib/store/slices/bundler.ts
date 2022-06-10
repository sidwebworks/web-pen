import { createSlice } from "@reduxjs/toolkit";
import { BUNDLE_CODE, INIT_BUNDLER } from "../thunks";

type IBunderState = {
  isInitialized: boolean;
  isError: boolean;
  isBundling: boolean;
  error: { frame: string; file: string };
};

const initialState: IBunderState = {
  isBundling: false,
  isError: false,
  isInitialized: false,
  error: { file: "", frame: "" },
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
      state.error = {
        file: "",
        frame: "",
      };
      state.isBundling = true;
    });
    builder.addCase(BUNDLE_CODE.fulfilled, (state) => {
      state.isBundling = false;
    });
    builder.addCase(BUNDLE_CODE.rejected, (state, action) => {
      state.isBundling = false;
      state.isError = true;
      state.error = {
        file: action.error.stack,
        frame: action.error.message,
      };
    });
  },
});


export default slice;

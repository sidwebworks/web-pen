import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IPreviewState = {
  source: {
    html: string;
    css: string;
    js: string;
  };
  error: string;
};

const initialState: IPreviewState = {
  source: {
    html: "",
    css: "",
    js: "",
  },
  error: "",
};

const slice = createSlice({
  name: "preview",
  initialState,
  reducers: {
    UPDATE_SOURCE(state, action: PayloadAction<IPreviewState["source"]>) {
      state.source = action.payload;
    },
    UPDATE_ERROR(state, action: PayloadAction<IPreviewState["error"]>) {
      state.error = action.payload;
    },
  },
});

export const { UPDATE_SOURCE, UPDATE_ERROR } = slice.actions;

export default slice;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IPreviewState = {
  source: {
    html: string;
    css: string;
    js: string;
  };
};

const initialState: IPreviewState = {
  source: {
    html: "",
    css: "",
    js: "",
  },
};

const slice = createSlice({
  name: "preview",
  initialState,
  reducers: {
    UPDATE_SOURCE(state, action: PayloadAction<IPreviewState["source"]>) {
      state.source = action.payload;
    },
  },
});

export const { UPDATE_SOURCE } = slice.actions;

export default slice;

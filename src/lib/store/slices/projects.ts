import { createSlice } from "@reduxjs/toolkit";
import { Directory } from "@typings/editor";
import { LOAD_PROJECTS } from "../thunks";

type IProjectState = {
  items: Record<string, Directory>;
};

const initialState: IProjectState = {
  items: {},
};

const slice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(LOAD_PROJECTS.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default slice;

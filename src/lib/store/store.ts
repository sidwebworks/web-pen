import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { editorMiddleware } from "./middlewares";
import bundler from "./slices/bundler";
import editor from "./slices/editor";
import preview from "./slices/preview";
import project from "./slices/projects";

const store = configureStore({
  reducer: {
    [editor.name]: editor.reducer,
    [project.name]: project.reducer,
    [preview.name]: preview.reducer,
    [bundler.name]: bundler.reducer,
  },
  middleware: (prev) => prev().concat([editorMiddleware]),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store["dispatch"];

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useTypedDispatch = () => useDispatch<typeof store["dispatch"]>();

export default store;

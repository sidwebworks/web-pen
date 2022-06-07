import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import editor from "./slices/editor";
import bundler from "./slices/bundler";
import preview from "./slices/preview";
import { editorMiddleware } from "./middlewares";

const store = configureStore({
  reducer: {
    [editor.name]: editor.reducer,
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

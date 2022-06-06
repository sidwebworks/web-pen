import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import editor from "./slices/editor";
import bundler from "./slices/bundler";
import preview from "./slices/preview";

const store = configureStore({
  reducer: {
    [editor.name]: editor.reducer,
    [preview.name]: preview.reducer,
    [bundler.name]: bundler.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useTypedDispatch = () => useDispatch<typeof store["dispatch"]>();

export default store;

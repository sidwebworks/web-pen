import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Directory,
  DirectoryTypes,
  Selectable,
  TextModel,
} from "@typings/editor";
import { isFile } from "@typings/guards";
import { editor } from "monaco-editor";
import { createStorage, toGitRaw } from "..";
import Bundler, { BuildInput } from "../../bundler";
import { createDirectory, getFilesTemplate } from "../fs/filesystem";
import { UPDATE_ROOT_DIR } from "./slices/editor";
import { UPDATE_SOURCE } from "./slices/preview";
import { RootState } from "./store";
import nightOwl from "../../components/editor/themes/night_owl.json";

const bundler = new Bundler();

export const fileStore = createStorage("__FILES__");

export const themeStore = createStorage("__THEMES__");

themeStore.setItem("Night Owl", nightOwl);

export const BUNDLE_CODE = createAsyncThunk<string, BuildInput["tree"]>(
  "bundler/BUNDLE_CODE",
  async (tree, { dispatch, getState }) => {
    const isInitialized = (getState() as RootState).bundler.isInitialized;

    if (!Object.keys(tree).length || !isInitialized) return;

    const entry = Object.keys(tree).find(
      (e) => e.startsWith("/main") && (e.endsWith(".js") || e.endsWith(".ts"))
    );

    if (!entry) return;

    const result = await bundler.build({ tree, entry: entry });

    const source = {
      js: String(result.outputFiles[0].text),
      css: tree["/styles.css"],
      html: tree["/index.html"],
    };

    dispatch(UPDATE_SOURCE(source));

    return source["js"] || "";
  }
);

export const INIT_BUNDLER = createAsyncThunk(
  "bundler/INIT_BUNDLER",
  async () => {
    if (Bundler.initialized) return;

    await bundler.initialize();
  }
);

export const LOAD_INITIAL_FILES = createAsyncThunk(
  "editor/LOAD_INITIAL_FILES",
  async (arg: string = "", { dispatch }) => {
    const found = await fileStore.getItem(arg);

    if (found) {
      return dispatch(UPDATE_ROOT_DIR(found as Directory));
    }

    const dir = createDirectory({
      children: [],
      isOpen: true,
      name: "root",
      parent: "/",
      type: DirectoryTypes.DEFAULT,
    });

    const files = getFilesTemplate();

    dir.children = files;

    dispatch(UPDATE_ROOT_DIR(dir));
  }
);

export const SAVE_FILES = createAsyncThunk<
  void,
  { key: string; models: Record<string, TextModel> }
>("bundler/SAVE_FIlES", async ({ models, key }, { getState }) => {
  const dir = (getState() as RootState).editor.dir;

  const computed = dir.children.reduce((acc, curr) => {
    if (isFile(curr)) {
      curr = {
        ...curr,
        content: models[curr.path].getValue(),
      };

      acc.push(curr);
    }

    return acc;
  }, []);

  await fileStore.setItem(key, { ...dir, children: computed });
});

export const FETCH_THEMES = createAsyncThunk(
  "bundler/FETCH_THEMES",
  async (_, { getState }) => {
    const state = getState() as RootState;

    if (state.editor.themes.length > 0) return;

    try {
      const res = await fetch(
        toGitRaw(
          "https://github.com/brijeshb42/monaco-themes/blob/master/themes/themelist.json"
        )
      );

      const themes = await res.json();

      const transformed = Object.keys(themes).reduce<
        { label: string; value: string }[]
      >((acc, curr) => {
        acc.push({ label: themes[curr], value: curr });

        return acc;
      }, []);

      return transformed;
    } catch (error) {
      return [];
    }
  }
);

export const LOAD_THEME = createAsyncThunk<
  editor.IStandaloneThemeData,
  Selectable<string>
>("bundler/LOAD_THEME", async (item) => {
  const inCache = await themeStore.getItem(item.label);

  if (inCache) {
    return inCache as editor.IStandaloneThemeData;
  }

  const encodedName = encodeURI(item.label);

  const url = toGitRaw(
    `https://github.com/brijeshb42/monaco-themes/blob/master/themes/${encodedName}.json`
  );

  const theme = await (await fetch(url)).json();

  await themeStore.setItem(item.label, theme);

  return theme as editor.IStandaloneThemeData;
});


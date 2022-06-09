import { isSSR } from "@hooks/common";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Directory, Selectable, TextModel } from "@typings/editor";
import { isFile } from "@typings/guards";
import { ProjectTypes } from "@typings/projects";
import { BuildResult } from "esbuild-wasm";
import { editor } from "monaco-editor";
import { nanoid } from "nanoid";
import { createProjectName, createStorage, toGitRaw } from "..";
import Bundler, { BuildInput } from "../../bundler";
import nightOwl from "../monaco/themes/night_owl.json";
import { VANILLA_JS, VANILLA_TS } from "../templates";
import { CLOSE_ALL_TABS, UPDATE_ROOT_DIR } from "./slices/editor";
import { UPDATE_SOURCE } from "./slices/preview";
import { RootState } from "./store";

const bundler = new Bundler();

export const fileStore = createStorage("__FILES__");

export const themeStore = createStorage("__THEMES__");

if (!isSSR) {
  themeStore.setItem("Night Owl", nightOwl);
}

export const BUNDLE_CODE = createAsyncThunk<string, BuildInput["tree"]>(
  "bundler/BUNDLE_CODE",
  async (tree, { dispatch, getState }) => {
    const isInitialized = (getState() as RootState).bundler.isInitialized;

    if (!Object.keys(tree).length || !isInitialized) return;

    const entry = Object.keys(tree).find(
      (e) => e.startsWith("/main") && (e.endsWith(".js") || e.endsWith(".ts"))
    );

    if (!entry) return;

    const result = (await bundler.build({ tree, entry: entry })) as BuildResult;

    const decoder = new TextDecoder();

    const source = {
      js: decoder.decode(result.outputFiles[0].contents),
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

    dispatch(CLOSE_ALL_TABS());

    if (found) {
      return dispatch(UPDATE_ROOT_DIR(found as Directory));
    }

    const dir = VANILLA_JS(arg || `vanilla_${nanoid()}`);

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

    if (state.editor.themes.length > 0) return state.editor.themes;

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

export const LOAD_PROJECTS = createAsyncThunk(
  "projects/LOAD_PROJECTS",
  async () => {
    try {
      const items = await fileStore.read();
      return items;
    } catch (error) {
      return [];
    }
  }
);

export const CREATE_PROJECT = createAsyncThunk<string, ProjectTypes>(
  "projects/CREATE_PROJECT",
  async (template) => {
    let temp: Directory;

    switch (template) {
      case ProjectTypes.VanillaJavascript:
        temp = VANILLA_JS(createProjectName());
        break;
      case ProjectTypes.VanillaTypescript:
        temp = VANILLA_TS(createProjectName());
        break;
      default:
        throw new Error(`Unknown template ${template}`);
    }

    await fileStore.setItem(temp.id, temp);

    return temp.id;
  }
);

export const DELETE_PROJECT = createAsyncThunk<void, string>(
  "projects/DELETE_PROJECT",
  async (id, { dispatch }) => {
    await fileStore.removeItem(id);

    await dispatch(LOAD_PROJECTS());
  }
);

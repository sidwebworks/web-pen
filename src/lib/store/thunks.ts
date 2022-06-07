import { createAsyncThunk } from "@reduxjs/toolkit";
import { DirectoryTypes, TextModel } from "@typings/editor";
import { isFile } from "@typings/guards";
import { createStorage } from "..";
import Bundler, { BuildInput } from "../../bundler";
import { createDirectory, getFilesTemplate } from "../fs/filesystem";
import { UPDATE_ROOT_DIR } from "./slices/editor";
import { UPDATE_SOURCE } from "./slices/preview";
import { RootState } from "./store";

const bundler = new Bundler();

export const fileStore = createStorage("__FILES__");

export const BUNDLE_CODE = createAsyncThunk<string, BuildInput["tree"]>(
  "bundler/BUNDLE_CODE",
  async (tree, { dispatch }) => {
    if (!Object.keys(tree).length) return;

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
  async (arg: string, { dispatch }) => {
    const found = await fileStore.getItem(arg);

    if (found) {
      return dispatch(UPDATE_ROOT_DIR(found));
    }

    const dir = createDirectory({
      children: [],
      isOpen: true,
      name: "/",
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
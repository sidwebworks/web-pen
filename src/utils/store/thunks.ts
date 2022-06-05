import { createAsyncThunk } from "@reduxjs/toolkit";
import Bundler, { BuildInput } from "../../bundler";
import { RootState } from "./store";

const bundler = new Bundler();

export const BUNDLE_CODE = createAsyncThunk<string, Omit<BuildInput, "loader">>(
  "bundler/BUNDLE_CODE",
  async (arg) => {
    const result = await bundler.build({ tree: arg.tree, entry: arg.entry });

    return result.outputFiles[0].text;
  }
);

export const INIT_BUNDLER = createAsyncThunk(
  "bundler/INIT_BUNDLER",
  async () => {
    if (Bundler.initialized) return;

    await bundler.initialize();
  }
);

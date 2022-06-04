import { Plugin } from "esbuild-wasm";

type CreatePluginCallback<T = undefined> = T extends undefined
  ? () => Plugin
  : (data: T) => Plugin;

export const createPlugin = <T>(fn: CreatePluginCallback<T>) => {
  return fn;
};

import { Plugin } from "esbuild-wasm";


export const createPlugin = <T = undefined>(
  fn: T extends undefined ? () => Plugin : (data: T) => Plugin
) => {
  return fn;
};

import { Plugin, Loader } from "esbuild-wasm";

export const createPlugin = <T = undefined>(
  fn: T extends undefined ? () => Plugin : (data: T) => Plugin
) => {
  return fn;
};

export function getLoaderFromPath(name: string, defaultLoader?: Loader) {
  return (name.split(".").slice(-1)[0] || defaultLoader) as Loader;
}

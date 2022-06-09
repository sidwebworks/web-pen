import { EditorLanguages } from "@typings/editor";
import { createInstance } from "localforage";

export const createStorage = (key: string) => {
  const instance = createInstance({ name: key });
  return {
    async getItem<T>(key: string) {
      const found = await instance.getItem<T>(key);
      return found;
    },
    async setItem<T>(key: string, data: T) {
      await instance.setItem<T>(key, data);
      return true;
    },
    async removeItem<T>(key: string) {
      await instance.removeItem(key);
      return true;
    },
    async exists(key: string) {
      const exists = await instance.getItem(key);
      if (exists) return true;
      return false;
    },
  };
};


export const isMac = () => navigator.userAgent.match("Mac");

export function sanitizeHash(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace("?", "");
}

export function toGitRaw(url: string) {
  const BASE = "https://raw.githubusercontent.com";

  const _url = new URL(url);
  const parts = _url.pathname.split("/");
  const [user, repo, _, branch] = parts.slice(1, 5);
  const filename = parts.slice(parts.length - 2).join("/");

  const result = new URL(`${user}/${repo}/${branch}/${filename}`, BASE).href;
  return result; //?
}

export function normalizeThemeName(str: string) {
  if (typeof str !== "string") return "";

  if (str === "vs-dark") return str;

  return str
    .toLowerCase()
    .replace(/[^A-Za-z']/g, "")
    .replace(/\s+/g, "-");
}
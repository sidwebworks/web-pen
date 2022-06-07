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

export function getLanguage(filename: string): EditorLanguages {
  const ext = filename.split(".").slice(-1)[0] || "document";
  switch (ext) {
    case "jsx":
    case "js":
      return "javascript";
    case "tsx":
    case "ts":
      return "typescript";
    case "md":
      return "markdown";
    case "html":
      return "html";
    case "css":
      return "css";
    default:
      return "text";
  }
}

export const isMac = () => navigator.userAgent.match("Mac");

export function isEntryName(name: string) {
  return name === "main.js" || name === "main.ts";
}

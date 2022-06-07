import { Directory, File } from "@typings/editor";
import { nanoid } from "nanoid";
import { unix as path } from "path-fx";
import { Node } from "tree-model-improved/types";
import { createStorage } from "..";
import { css, html, js } from "./templates";

export function createFile(
  file: Omit<File, "id" | "createdAt" | "path">
): File {
  return {
    content: file.content || " ",
    mimeType: file.mimeType,
    createdAt: new Date().toISOString(),
    id: nanoid(),
    name: file.name,
    parent: file.parent || "/",
    path: path.join(file.parent || "/", file.name),
  };
}

export function createDirectory(
  dir: Omit<Directory, "id" | "createdAt" | "path">
): Directory {
  return {
    children: dir.children,
    createdAt: new Date().toISOString(),
    id: nanoid(),
    isOpen: dir.isOpen,
    parent: dir.parent || "/",
    name: dir.name,
    path: path.join(dir.parent || "/", dir.name),
    type: dir.type,
  };
}

export function getFilesTemplate(): (Directory | File)[] {
  return [
    createFile({
      content: html.trim(),
      mimeType: "text/html",
      name: "index.html",
    }),
    createFile({
      content: css.trim(),
      mimeType: "text/css",
      name: "styles.css",
    }),
    createFile({
      content: js.main.trim(),
      mimeType: "text/javascript",
      name: "main.js",
    }),
    createFile({
      content: js.app.trim(),
      mimeType: "text/javascript",
      name: "app.js",
    }),
  ];
}

export class FileSystem {
  private _tree: Node<File>;
  private key: string;
  isInitialized: boolean = false;
  private _cache: ReturnType<typeof createStorage>;
}

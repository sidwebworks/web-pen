import { Directory, EditorLanguages, File } from "@typings/editor";
import { nanoid } from "nanoid";
import { unix as path } from "path-fx";

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

export function isEntryName(name: string) {
  return name === "main.js" || name === "main.ts";
}

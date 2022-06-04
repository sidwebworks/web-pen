import type { editor } from "monaco-editor";
import { nanoid } from "nanoid";
import Model from "tree-model-improved";
import { unix as path } from "path-fx";
import { EditorLanguages } from "../../utils/typings/types";

export enum DirectoryTypes {
  DEFAULT = 1,
  HIDDEN = 0,
}

interface Item {
  id: string;
  path: string;
  parent?: string;
  name: string;
  createdAt: string;
}

export type File = Item & {
  content: string;
  source?: InstanceType<typeof window.File> | editor.ITextModel;
  mimeType: string;
};

export type Directory = Item & {
  type: DirectoryTypes;
  children: (File | Directory)[];
  isOpen: boolean;
};

export class FileSystem {
  private model = new Model();
  private _tree: Model.Node<Directory | File>;
  private static _instance = new FileSystem();

  static getInstance() {
    if (FileSystem._instance) return FileSystem._instance;

    FileSystem._instance = new FileSystem();

    return FileSystem._instance;
  }

  private constructor() {
    const dir = this.createDirectory({
      children: [],
      isOpen: true,
      name: "/",
      type: DirectoryTypes.DEFAULT,
    });

    this._tree = this.model.parse(dir);
  }

  init(items: (File | Directory)[]) {
    for (let item of items) {
      const node = this.model.parse(item);
      this._tree.addChild(node);
    }
  }

  parse(data: Model.Node<any>) {
    return this.model.parse(data);
  }

  visit() {
    return this._tree.all({ strategy: "post" }, (node) => {
      return !!node.model.content;
    });
  }

  get tree() {
    return this._tree;
  }

  getFiles(): File[] {
    const nodes = this.visit();
    return nodes.map((n) => n.model);
  }

  createDirectory(
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

  createFile(file: Omit<File, "id" | "createdAt" | "path">): File {
    return {
      content: file.content,
      mimeType: file.mimeType,
      createdAt: new Date().toISOString(),
      id: nanoid(),
      name: file.name,
      parent: file.parent || "/",
      source: file?.source,
      path: path.join(file.parent || "/", file.name),
    };
  }
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

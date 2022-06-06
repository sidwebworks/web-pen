import { Directory, File } from "@typings/interfaces";
import { DirectoryTypes } from "@typings/types";
import { nanoid } from "nanoid";
import { unix as path } from "path-fx";
import TreeModel from "tree-model-improved";
import { Model, Node } from "tree-model-improved/types";

export class FileSystem {
  private model = new TreeModel();
  private _tree: Node<Directory | File>;

  constructor() {
    const dir = this.createDirectory({
      children: [],
      isOpen: true,
      name: "/",
      parent: "/",
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

  parse(data: Model<File | Directory>) {
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
      content: file.content || " ",
      mimeType: file.mimeType,
      createdAt: new Date().toISOString(),
      id: nanoid(),
      name: file.name,
      parent: file.parent || "/",
      path: path.join(file.parent || "/", file.name),
    };
  }
}

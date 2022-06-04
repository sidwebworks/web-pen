import { useCallback, useMemo, useRef, useState } from "react";
import TreeModel from "tree-model-improved";
import { atom, useAtom } from "jotai";
import { DirectoryTypes, FileSystem } from "./file-system";
import { useMonaco } from "@monaco-editor/react";
import { activeTabs } from "../../store/editor";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

const fs = FileSystem.getInstance();

fs.init([
  fs.createDirectory({
    children: [
      fs.createDirectory({
        children: [
          fs.createFile({
            content: "I am a Styles file",
            mimeType: "text/css",
            name: "styles.css",
          }),
        ],
        isOpen: false,
        name: "styles",
        type: DirectoryTypes.DEFAULT,
      }),
      fs.createFile({
        content: "I am a Script file",
        mimeType: "text/javascript",
        name: "app.js",
      }),
    ],
    isOpen: false,
    name: "src",
    type: DirectoryTypes.DEFAULT,
  }),
  fs.createDirectory({
    children: [
      fs.createFile({
        content: "I am a Markup file",
        mimeType: "text/html",
        name: "index.html",
      }),
    ],
    isOpen: false,
    name: "public",
    type: DirectoryTypes.DEFAULT,
  }),
]);

export const useFileTree = () => {
  const [data, setData] = useState(() => fs.tree.model);
  const monaco = useMonaco();
  const [activeFiles, setActivTabs] = useAtom(activeTabs);

  const root = useMemo(() => fs.parse(data), [data]);

  const find = useCallback((id) => findById(root, id), [root]);

  const update = () => setData({ ...root.model });

  return {
    data,
    onToggle: (id: string, isOpen: boolean) => {
      const node = find(id);
      if (node) {
        node.model.isOpen = isOpen;
        update();
      }
    },
    onCreate(filename: string, type: "file" | "directory") {},
    onMove: (
      srcIds: string[],
      dstParentId: string | null,
      dstIndex: number
    ) => {
      for (const srcId of srcIds) {
        const src = find(srcId);
        const dstParent = dstParentId ? find(dstParentId) : root;
        if (!src || !dstParent) return;
        const newItem = fs.parse(src.model);
        dstParent.addChildAtIndex(newItem, dstIndex);
        src.drop();
      }
      update();
    },
    onEdit: (id: string, name: string) => {
      const node = find(id);
      if (node) {
        node.model.name = name;
        update();
      }
    },
  };
};

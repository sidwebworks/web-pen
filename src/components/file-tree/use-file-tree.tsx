import { useCallback, useMemo, useState } from "react";
import TreeModel from "tree-model-improved";
import { useFileSystem } from "../../hooks/use-filesystem";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

export const useFileTree = () => {
  const fs = useFileSystem();
  const [data, setData] = useState(() => fs.tree.model);
  const root = useMemo(() => fs.parse(data), [data, fs]);

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

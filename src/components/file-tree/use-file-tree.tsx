import { useEditorModels } from "@hooks/use-editor-models";
import { useMonaco } from "@monaco-editor/react";
import { unix as path } from "path-fx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getLanguage } from "src/lib";
import TreeModel from "tree-model-improved";
import { useFileSystem } from "../../hooks/use-filesystem";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

export const useFileTree = () => {
  const fs = useFileSystem();
  const monaco = useMonaco();
  const models = useEditorModels();

  console.log(models);

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
      console.log(name);
      const node = find(id);

      if (node) {
        const isFile = node.model?.content;
        const nextPath = path.join(node.model.parent, name);

        if (isFile) {
          node.model.mimeType = `text/${getLanguage(name)}`;

          const model = models[node.model.path];
          const content = model.getValue();

          monaco.editor.setModelLanguage(model, getLanguage(name));

          model.dispose();

          monaco.editor.createModel(
            content,
            getLanguage(name),
            new monaco.Uri().with({ path: nextPath })
          );
        }

        node.model.name = name;
        node.model.path = nextPath;

        update();
      }
    },
  };
};

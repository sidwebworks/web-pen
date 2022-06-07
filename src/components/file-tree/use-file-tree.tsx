import { useEditor } from "@hooks/use-editor";
import { useMonaco } from "@monaco-editor/react";
import { Directory } from "@typings/editor";
import { isFile } from "@typings/guards";
import { cloneDeep } from "lodash-es";
import { unix as path } from "path-fx";
import { useCallback, useMemo, useRef } from "react";
import { getLanguage, isEntryName } from "src/lib";
import { SET_ACTIVE_TAB, UPDATE_ROOT_DIR } from "src/lib/store/slices/editor";
import { useTypedDispatch } from "src/lib/store/store";
import TreeModel from "tree-model-improved";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

export const useFileTree = (data: Directory) => {
  const dispatch = useTypedDispatch();
  const model = useRef(null);
  const { editor, monaco } = useEditor();

  if (!model.current) {
    model.current = new TreeModel();
  }

  const root = useMemo(() => {
    return model.current.parse(cloneDeep(data));
  }, [data]);

  const find = useCallback((id) => findById(root, id), [root]);

  const update = () => dispatch(UPDATE_ROOT_DIR({ ...root.model }));

  return {
    data,
    onToggle: (id: string, isOpen: boolean) => {
      const node = find(id);
      if (node && !node.model?.content) {
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

        const newItem = model.current.parse(src.model);

        dstParent.addChildAtIndex(newItem, dstIndex);

        src.drop();
      }
      update();
    },
    onEdit: (id: string, name: string) => {
      const node = find(id);

      if (node) {
        const nextPath = path.join(node.model.parent, name);

        if (isFile(node.model)) {
          const file = node.model;

          if (isEntryName(file.name) && !isEntryName(name)) return;

          const models = monaco.editor.getModels();

          const model = models.find((m) => m.uri.path === file.path);

          if (model) {
            const content = model.getValue();

            model.dispose();

            monaco.editor.createModel(
              content,
              getLanguage(name),
              monaco.Uri.parse(nextPath)
            );

            dispatch(SET_ACTIVE_TAB({ id: file.id, path: nextPath }));
          }
        }

        node.model.name = name;
        node.model.path = nextPath;

        update();
      }
    },
  };
};

import { useEditor } from "@hooks/use-editor";
import { useMonaco } from "@monaco-editor/react";
import { Directory } from "@typings/editor";
import { isFile } from "@typings/guards";
import { cloneDeep } from "lodash-es";
import { unix as path } from "path-fx";
import { useCallback, useMemo, useRef } from "react";
import { getLanguage, isEntryName } from "src/lib";
import {
  CLOSE_ACTIVE_TAB,
  SET_ACTIVE_TAB,
  UPDATE_ROOT_DIR,
} from "src/lib/store/slices/editor";
import { useTypedDispatch } from "src/lib/store/store";
import TreeModel from "tree-model-improved";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

export const useFileTree = (data: Directory) => {
  const dispatch = useTypedDispatch();
  const model = useRef(null);
  const { monaco } = useEditor();

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
        const prev = { ...node.model };

        node.model.name = name;
        node.model.path = path.join(node.model.parent, name);

        if (isFile(node.model)) {
          const file = node.model;

          const models = monaco.editor.getModels();

          const model = models.find((m) => m.uri.path === prev.path);

          if (isEntryName(prev.name) && !isEntryName(name)) {
            file.name = prev.name;
            file.path = prev.path;
            console.log("STOPPED");
            update();
            return;
          }

          if (model) {
            const content = model.getValue();

            model.dispose();

            monaco.editor.createModel(
              content,
              getLanguage(file.name),
              monaco.Uri.parse(file.path)
            );

            dispatch(CLOSE_ACTIVE_TAB({ id: prev.id, path: prev.path }));

            dispatch(SET_ACTIVE_TAB({ id: file.id, path: file.path }));
          }
        }
      }

      update();
    },
  };
};

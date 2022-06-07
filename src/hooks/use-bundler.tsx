import { useCallback } from "react";
import { useTypedDispatch } from "../lib/store/store";
import { BUNDLE_CODE } from "../lib/store/thunks";
import { useEditor } from "./use-editor";

export const useBundler = () => {
  const { monaco, editor } = useEditor();
  const dispatch = useTypedDispatch();

  const build = useCallback(
    async (format: boolean = false) => {
      if (!monaco) return;

      if (format) {
        editor.getAction("editor.action.formatDocument").run();
      }

      const models = monaco.editor.getModels();

      const tree = models.reduce<Record<string, string>>((acc, curr) => {
        acc[curr.uri.path] = curr.getValue().trim();
        return acc;
      }, {});

      const result = await dispatch(BUNDLE_CODE(tree));

      return result;
    },
    [monaco, dispatch, editor]
  );

  return { build };
};

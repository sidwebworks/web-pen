import { useCallback, useMemo, useRef } from "react";
import { UPDATE_SOURCE } from "src/lib/store/slices/preview";
import { useTypedDispatch } from "../lib/store/store";
import { BUNDLE_CODE } from "../lib/store/thunks";
import { useEditorModels } from "./use-editor-models";
import { useLocalContext } from "./use-local-context";

export const useBundler = () => {
  const models = useEditorModels();
  const dispatch = useTypedDispatch();
  const ctx = useLocalContext(models);

  const getTree = useCallback(() => {
    const result = Object.entries(ctx.current).reduce((acc, [path, model]) => {
      acc[path] = model.getValue().trim();

      return acc;
    }, {});

    return result;
  }, [ctx]);

  const build = async () => {
    const entry = "main.js";

    const tree = getTree();

    const result = await dispatch(BUNDLE_CODE({ entry, tree }));

    dispatch(
      UPDATE_SOURCE({
        js: String(result.payload),
        css: tree["/styles.css"],
        html: tree["/index.html"],
      })
    );

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return { build };
};

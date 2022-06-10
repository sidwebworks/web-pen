import { useEditor } from "@hooks/use-editor";
import { Directory } from "@typings/editor";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { Tree, TreeApi } from "react-arborist";
import AutoSize from "react-virtualized-auto-sizer";
import { useTypedSelector } from "../../lib/store/store";
import FileTreeItem from "./FileTreeItem";
import { useFileTree } from "./use-file-tree";

interface FileNavigationProps {
  files: Directory;
}

const FileTree: React.FC<FileNavigationProps> = ({ files }) => {
  const { data, onToggle, onMove, onEdit } = useFileTree(files);
  const { monaco, editor } = useEditor();

  const tabs = useTypedSelector((s) => s.editor.tabs);


  const ref = useRef<TreeApi<Directory>>(null);

  useEffect(() => {
    if (!ref.current || !monaco || !editor) return;

    const active = Object.keys(tabs).find((el) => tabs[el].isActive);

    const models = monaco.editor.getModels();

    const model = models.find((m) => m.uri.path === tabs[active]?.path);

    if (active && tabs[active] && model) {
      ref.current.selectById(tabs[active].id);
      editor.setModel(model);
    } else {
      ref.current.selectById("");
      editor.setModel(null);
    }
  }, [tabs, monaco, editor, files]);

  return (
    <div
      className={clsx(
        "h-full z-10 flex overflow-clip will-change flex-col relative py-1 bg-dark-900 border-r border-dark-600"
      )}
    >
      <AutoSize>
        {(props) => (
          <Tree
            openByDefault={true}
            className="react-aborist"
            getChildren="children"
            isOpen={"isOpen"}
            indent={12}
            rowHeight={24}
            ref={ref}
            data={data}
            hideRoot
            onToggle={onToggle}
            onEdit={onEdit}
            onMove={onMove}
            width={props.width}
            height={props.height}
          >
            {/* @ts-ignore */}
            {FileTreeItem}
          </Tree>
        )}
      </AutoSize>
    </div>
  );
};

export default FileTree;

import { useEditorModels } from "@hooks/use-editor-models";
import { Directory } from "@typings/interfaces";
import React, { useEffect, useRef } from "react";
import { Tree, TreeApi } from "react-arborist";
import AutoSize from "react-virtualized-auto-sizer";
import { useTypedSelector } from "../../utils/store/store";
import { TreeItem } from "./file-tree-item";
import { useFileTree } from "./use-file-tree";

interface FileNavigationProps {}

const FileTree: React.FC<FileNavigationProps> = () => {
  const { data, onToggle, onMove, onEdit } = useFileTree();
  const tabs = useTypedSelector((s) => s.editor.tabs);
  const ref = useRef<TreeApi<Directory> | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const active = Object.keys(tabs).find((el) => tabs[el].isActive);

    if (active && tabs[active]) {
      ref.current.selectById(tabs[active].id);
    } else {
      ref.current.selectById("");
    }
  }, [tabs]);

  return (
    <div className="h-screen w-[180px] z-10 flex flex-col relative py-4 overflow-y-clip bg-dark-900 border-r border-dark-600">
      <AutoSize>
        {(props: any) => (
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
            onContextMenu={() => console.log("context menu the tree")}
          >
            {/* @ts-ignore */}
            {TreeItem}
          </Tree>
        )}
      </AutoSize>
    </div>
  );
};

export default FileTree;

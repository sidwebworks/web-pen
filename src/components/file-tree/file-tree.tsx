import React, { useRef } from "react";
import { Tree } from "react-arborist";
import AutoSize from "react-virtualized-auto-sizer";
import { TreeItem } from "./file-tree-item";
import { useFileTree } from "./use-file-tree";

interface FileNavigationProps {}

const FileTree: React.FC<FileNavigationProps> = () => {
  const { data, onToggle, onMove } = useFileTree();

  return (
    <div className="h-screen w-[180px] z-10 flex flex-col relative py-4 overflow-y-clip bg-dark-900 border-r border-dark-600">
      <AutoSize>
        {(props: any) => (
          <Tree
            openByDefault={true}
            className="react-aborist"
            getChildren="children"
            isOpen="isOpen"
            indent={12}
            rowHeight={24}
            data={data}
            hideRoot
            onToggle={onToggle}
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

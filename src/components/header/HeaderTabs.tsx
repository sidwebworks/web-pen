import { FileIcon } from "@components/file-tree/file-tree-item";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { memo, MouseEventHandler, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  CLOSE_ACTIVE_TAB,
  SET_ACTIVE_TAB,
} from "../../lib/store/slices/editor";
import { useTypedSelector } from "../../lib/store/store";

type TabFile = {
  name: string;
  path: string;
  id: string;
  isActive: boolean;
};

export const Tabs = () => {
  const tabs = useTypedSelector((s) => s.editor.tabs);
  const dispatch = useDispatch();

  const files: TabFile[] = useMemo(
    () =>
      Object.entries(tabs).map(([id, tab]) => ({
        name: tab.path.split("/").at(-1) || "",
        path: tab.path,
        id: id,
        isActive: tab.isActive,
      })),
    [tabs]
  );

  const handleOpen = (file: TabFile) => {
    if (!file || file.isActive) return;
    dispatch(SET_ACTIVE_TAB({ id: file.id, path: file.path }));
  };

  const handleClose = (file: TabFile) => {
    if (!file) return;
    dispatch(CLOSE_ACTIVE_TAB({ id: file.id, path: file.path }));
  };

  return (
    <div className="relative z-10 flex items-center gap-x-4">
      {files.map((file) => (
        <Tab
          key={file.path}
          file={file}
          onClick={handleOpen}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

const Tab = memo(({ file, onClick, onClose }: any) => {
  const { name, isActive } = file;

  const handleSelect = () => {
    onClick(file);
  };

  const handleClose: MouseEventHandler = (e) => {
    e.stopPropagation();
    onClose(file);
  };

  return (
    <button
      onClick={handleSelect}
      title={name}
      className={clsx(
        "text-sm transition-all group flex gap-x-1 items-center duration-200 ease-in-out",
        isActive
          ? "border-cyan-500 text-cyan-600"
          : "text-true-gray-600  border-true-gray-700 hover:text-opacity-70"
      )}
    >
      <FileIcon isFolder={false} name={name} />
      {name}
      <XIcon
        onClick={handleClose}
        className="w-4 h-4 fill-current mt-0.7 text-true-gray-800 hover:text-red-500"
      />
    </button>
  );
});

Tab.displayName = "Tab";

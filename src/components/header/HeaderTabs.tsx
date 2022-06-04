import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useAtom } from "jotai";
import { filter } from "lodash-es";
import { MouseEventHandler, useMemo } from "react";
import { activeTabs } from "../../store/editor";

export const Tabs = () => {
  const [active, setActive] = useAtom(activeTabs);

  const files = useMemo(
    () =>
      Object.keys(active).map((path) => ({
        name: path.split("/").at(-1),
        path,
        isActive: active[path],
      })),
    [active]
  );

  const handleOpen = (path: string) => {
    if (!path) return;

    setActive((p) => {
      Object.keys(p).forEach((v) => (p[v] = false));
      return { ...p, [path]: true };
    });
  };

  const handleClose = (path: string) => {
    if (!path) return;

    setActive((p) => {
      Object.keys(p).forEach((v) => (p[v] = false));
      delete p[path];
      return { ...p };
    });
  };

  return (
    <div className="relative z-10 flex items-center gap-x-4">
      {files.map((file) => (
        <Tab
          key={file.path}
          name={file.name}
          path={file.path}
          isActive={file.isActive}
          onClick={handleOpen}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

const Tab = ({ name, path, isActive, onClick, onClose }: any) => {
  const handleSelect = () => {
    onClick(path);
  };

  const handleClose: MouseEventHandler = (e) => {
    e.stopPropagation();
    onClose(path);
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
      {name}
      <XIcon
        onClick={handleClose}
        className="w-4 h-4 fill-current mt-0.7 text-true-gray-800 hover:text-red-500"
      />
    </button>
  );
};

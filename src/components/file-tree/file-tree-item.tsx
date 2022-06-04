import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useAtom, useSetAtom } from "jotai";
import Image from "next/image";
import { FocusEvent, KeyboardEvent, MouseEventHandler } from "react";
import { NodeHandlers } from "react-arborist";
import { NodeRendererProps } from "react-arborist/src/types";
import { activeTabs } from "../../store/editor";
import { Directory, File } from "./file-system";

const size = 16;
const color = "#999";

function MaybeToggleButton({ toggle, isOpen, isFolder, isSelected }: any) {
  if (isFolder) {
    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;
    return (
      <button tabIndex={-1} onClick={toggle}>
        <Icon width={size} height={size} fill={isSelected ? "white" : color} />
      </button>
    );
  } else {
    return <div className="spacer" />;
  }
}

function Icon({ isFolder, icon, isOpen }: any) {
  if (isFolder) {
    return (
      <Image
        width={size}
        layout="fixed"
        height={size}
        loading="eager"
        alt={`file-icon-${icon}`}
        src={isOpen ? `/icons/${icon}-open.svg` : `/icons/${icon}.svg`}
      />
    );
  } else {
    return (
      <Image
        width={size}
        layout="fixed"
        height={size}
        loading="eager"
        alt={`file-icon-${icon}`}
        src={`/icons/${icon}.svg`}
      />
    );
  }
}

type TreeItemProps<T> = T extends File
  ? NodeRendererProps<File>
  : NodeRendererProps<Directory>;

export function TreeItem<T extends unknown>({
  innerRef,
  data,
  styles,
  state,
  handlers,
}: TreeItemProps<T>) {
  const folder = data.children;
  const setActive = useSetAtom(activeTabs);

  const name = data.name;

  const handleSelect: MouseEventHandler = (e) => {
    if (!folder) {
      setActive((p) => {
        Object.keys(p).forEach((v) => (p[v] = false));
        return { ...p, [data.path]: true };
      });
    } else {
      handlers.toggle(e);
    }

    handlers.select(e, { selectOnClick: true });
  };

  return (
    <div
      ref={innerRef}
      style={styles.row}
      className={clsx("row", state.isSelected && !folder && "bg-dark-800")}
      onClick={handleSelect}
    >
      <div className="row-contents leading-none pb-1" style={styles.indent}>
        <MaybeToggleButton
          toggle={handlers.toggle}
          isOpen={state.isOpen}
          isFolder={folder}
          isSelected={state.isSelected}
        />
        {state.isEditing ? (
          <RenameForm defaultValue={name} {...handlers} />
        ) : (
          <div
            className={clsx(
              "flex justify-between items-center",
              state.isSelected && !folder
                ? "text-cyan-500"
                : "text-true-gray-500"
            )}
          >
            {name}
          </div>
        )}
      </div>
    </div>
  );
}

type FormProps = { defaultValue: string } & NodeHandlers;

function RenameForm({ defaultValue, submit, reset }: FormProps) {
  const inputProps = {
    defaultValue,
    autoFocus: true,
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      submit(e.currentTarget.value);
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          submit(e.currentTarget.value);
          break;
        case "Escape":
          reset();
          break;
      }
    },
  };

  return <input type="text" {...inputProps} />;
}

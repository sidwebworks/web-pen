import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { Directory } from "@typings/interfaces";
import clsx from "clsx";
import Image from "next/image";
import { FocusEvent, KeyboardEvent, MouseEventHandler } from "react";
import { NodeHandlers } from "react-arborist";
import { NodeRendererProps } from "react-arborist/src/types";
import { useTypedDispatch } from "src/utils/store/store";
import { SET_ACTIVE_TAB } from "../../utils/store/slices/editor";
import { getIcon } from "./file-tree.helpers";

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

export function FileIcon({ isFolder, name, isOpen }: any) {
  const icon = getIcon(name, !isFolder);

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
  const dispatch = useTypedDispatch();

  const name = data.name;

  const handleSelect: MouseEventHandler = (e) => {
    if (!folder && !state.isSelected) {
      dispatch(SET_ACTIVE_TAB({ id: data.id, path: data.path }));
    } else {
      handlers.toggle(e);
    }
    handlers.select(e, { selectOnClick: true });
  };

  return (
    <div
      ref={innerRef}
      style={styles.row}
      className={clsx(
        "row hover:bg-dark-700 !cursor-pointer",
        state.isSelected && !folder && "bg-dark-800"
      )}
      onClick={handleSelect}
    >
      <div
        className="row-contents !mx-1 leading-none pb-1"
        style={styles.indent}
      >
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
              "flex  items-center justify-evenly",
              state.isSelected && !folder
                ? "text-cyan-500"
                : "text-true-gray-500"
            )}
          >
            <i>
              <FileIcon
                isFolder={folder}
                name={data.name}
                isOpen={state.isOpen}
              />
            </i>
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

import { CogIcon } from "@heroicons/react/outline";
import {
  ChevronDoubleRightIcon,
  LightningBoltIcon,
  MenuAlt2Icon as FormatIcon,
} from "@heroicons/react/solid";
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { TOGGLE_SIDEBAR } from "src/lib/store/slices/editor";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import { Tabs } from "./HeaderTabs";

type HeaderButtonProps = Pick<
  ComponentPropsWithoutRef<"button">,
  "onClick" | "children" | "className" | "aria-label" | "title"
>;

function Header({
  onFormat,
  onBundle,
}: {
  onFormat: () => void;
  onBundle: () => void;
}) {
  const isSidebarOpen = useTypedSelector((s) => s.editor.isSidebarOpen);

  const dispatch = useTypedDispatch();

  return (
    <header className="w-full relative py-2.5 bg-dark-900 flex gap-x-3 px-5 border-b  border-dark-600 items-center">
      <HeaderButton
        onClick={() => dispatch(TOGGLE_SIDEBAR())}
        aria-label="Format code"
        title="Format"
        className="rounded-full btn btn-xs"
      >
        <ChevronDoubleRightIcon
          className={clsx(
            "w-5 h-5 text-cyan-400 fill-current transition-transform duration-250  transform",
            isSidebarOpen ? "rotate-[180deg]" : "rotate-[0deg]"
          )}
        />
      </HeaderButton>
      <Tabs />
      <div className="flex items-center max-w-sm gap-4 ml-auto">
        <HeaderButton
          onClick={onFormat}
          aria-label="Format code"
          title="Format"
          className="rounded-full btn btn-xs"
        >
          <FormatIcon className="w-5 h-5 text-green-400 fill-current" />
        </HeaderButton>
        <HeaderButton
          aria-label="Bundle code"
          onClick={onBundle}
          title="Bundle"
          className="rounded-full btn btn-xs"
        >
          <LightningBoltIcon className="w-4 h-4 fill-current text-cyan-400" />
        </HeaderButton>
        <HeaderButton aria-label="Open settings" title="Settings">
          <CogIcon className="w-5 h-5  text-true-gray-500  stroke-current" />
        </HeaderButton>
      </div>
    </header>
  );
}

function HeaderButton({
  children,
  onClick = () => {},
  title,
  className,
  ...rest
}: HeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx("rounded-full active:scale-90 transform", className)}
      {...rest}
      role="button"
    >
      {children}
    </button>
  );
}

export default Header;

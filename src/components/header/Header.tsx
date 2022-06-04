import { CogIcon } from "@heroicons/react/outline";
import {
  LightningBoltIcon,
  MenuAlt2Icon as FormatIcon,
} from "@heroicons/react/solid";
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { Tabs } from "./HeaderTabs";

type HeaderButtonProps = Pick<
  ComponentPropsWithoutRef<"button">,
  "onClick" | "children" | "className" | "aria-label" | "title"
>;

export function Header({}) {
  return (
    <header className="w-full py-2.5 bg-dark-900 flex gap-x-3 px-5 border-b  border-dark-600 items-center flex-grow ">
      <Tabs />
      <div className="flex items-center max-w-sm gap-4 ml-auto">
        <HeaderButton
          aria-label="Format code"
          title="Format"
          className="rounded-full btn btn-xs"
        >
          <FormatIcon className="w-5 h-5 text-green-400 fill-current" />
        </HeaderButton>
        <HeaderButton
          aria-label="Bundle code"
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

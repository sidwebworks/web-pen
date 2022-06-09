import clsx from "clsx";
import { debounce, max } from "lodash-es";
import React, { FC, PropsWithChildren, ReactNode, useMemo } from "react";
import SplitPane, { Size } from "react-split-pane";
import { useWindowDimensions } from "../../hooks/use-window-dimensions";

interface SplitLayoutProps {
  children: ReactNode;
  maxSize: number;
  className?: string;
  size?: Size;
  minSize: number;
  fillParent?: boolean;
  defaultSize?: Size;
}

export const Root: React.FC<SplitLayoutProps> = ({
  children,
  className,
  maxSize,
  size,
  minSize,
  defaultSize = "50%",
  fillParent = false,
}) => {
  const { width } = useWindowDimensions();

  const handleDragStart = () => {
    document.body.classList.add("react-draggable-transparent-selection");
  };

  const dimensions = useMemo(
    () => ({
      max: Math.abs(width - width / maxSize),
      min: Math.abs(width / minSize),
    }),
    [width, maxSize, minSize]
  );

  const handleDragEnd = debounce(() => {
    document.body.classList.remove("react-draggable-transparent-selection");
  }, 180);

  return (
    <div
      className={clsx(
        "flex w-full overflow-auto items-center top-0 relative",
        fillParent ? "h-full" : "h-screen",
        className
      )}
    >
      <SplitPane
        split="vertical"
        defaultSize={defaultSize}
        size={size}
        onDragFinished={handleDragEnd}
        onDragStarted={handleDragStart}
        resizerClassName={"react-resizable-handle"}
        maxSize={dimensions.max}
        minSize={dimensions.min}
        primary={"first"}
        paneStyle={{ overflow: "auto" }}
        className={"!h-full react-resizer bg-dark-500 top-0"}
      >
        {children}
      </SplitPane>
    </div>
  );
};

export const Pane: FC<PropsWithChildren<{ id: string }>> = ({
  children,
  id,
}) => {
  return (
    <div id={id} className="bg-dark-800 w-full overflow-auto h-full">
      {children}
    </div>
  );
};

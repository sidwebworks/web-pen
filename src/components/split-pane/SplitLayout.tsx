import { debounce } from "lodash-es";
import React, { FC, PropsWithChildren, ReactNode } from "react";
import SplitPane from "react-split-pane";
import { useWindowDimensions } from "../../hooks/use-window-dimensions";

interface SplitLayoutProps {
  children: ReactNode;
}

export const Root: React.FC<SplitLayoutProps> = ({ children }) => {
  const { width } = useWindowDimensions();

  const handleDragStart = () => {
    document.body.classList.add("react-draggable-transparent-selection");
  };

  const handleDragEnd = debounce(() => {
    document.body.classList.remove("react-draggable-transparent-selection");
  }, 180);

  return (
    <div className="flex w-full overflow-auto items-center top-0 h-full relative">
      <SplitPane
        split="vertical"
        size={width / 2}
        onDragFinished={handleDragEnd}
        onDragStarted={handleDragStart}
        resizerClassName={"react-resizable-handle"}
        maxSize={width - width / 5}
        minSize={width / 5}
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

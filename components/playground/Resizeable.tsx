import { ResizableBox } from "react-resizable";
import { ResizableProps } from "../../typings/interfaces";
import { useResizeable } from "../../utils/hooks/use-resizeable";
import SplitPane from "react-split-pane";
import { useCallback, useState } from "react";

const HEADER_HEIGHT = 60 - 1;
const TAB_BAR_HEIGHT = 40;
const RESIZER_SIZE = 1;
const DEFAULT_RESPONSIVE_SIZE = { width: 540, height: 720 };

export const Resizeable: React.FC<any> = ({
	direction,
	children,
	initialLayout,
	initialActiveTab,
	height = Infinity,
}) => {
	const { width, innerHeight, innerWidth, setWidth } = useResizeable();

	const [activeTab, setActiveTab] = useState(initialActiveTab);
	const [activePane, setActivePane] = useState(
		initialLayout === "preview" ? "preview" : "editor"
	);

	const handleDragStart = () => {
		document.body.classList.add("react-draggable-transparent-selection");
	};

	const handleDragEnd = () => {
		document.body.classList.remove("react-draggable-transparent-selection");
	};

	return (
		//@ts-ignore
		<SplitPane
			split={"vertical"}
			minSize={50}
			defaultSize={width}
			size={width}
			className="react-resizer"
			resizerClassName={"react-resizable-handle"}
			onChange={(s: number) => setWidth(s)}
			paneStyle={{ marginTop: -1 }}
			pane1Style={{ display: "flex", flexDirection: "column" }}
			onDragStarted={handleDragStart}
			onDragFinished={handleDragEnd}
		>
			{children}
		</SplitPane>
	);
};

import { useState } from "react";
import SplitPane from "react-split-pane";
import { useResizeable } from "../../utils/hooks/use-resizeable";

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
			minSize={100}
			defaultSize={3000}
			size={width}
			primary="first"
			className="react-resizer"
			resizerClassName={"react-resizable-handle"}
			onChange={(s: number) => setWidth(s)}
			onDragStarted={handleDragStart}
			onDragFinished={handleDragEnd}
		>
			{children}
		</SplitPane>
	);
};

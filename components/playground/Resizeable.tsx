import SplitPane from "react-split-pane";
import { useResizeable } from "../../utils/hooks/use-resizeable";
import { debounce } from "../../utils";

export const Resizeable: React.FC<any> = ({ children, direction, ...rest }) => {
	const { width, innerWidth, innerHeight, setWidth } = useResizeable();

	const innerSize = direction === "vertical" ? innerWidth : innerHeight;

	const handleDragStart = () => {
		document.body.classList.add("react-draggable-transparent-selection");
	};

	const handleDragEnd = () => {
		document.body.classList.remove("react-draggable-transparent-selection");
	};

	const handleChange = debounce((s: number) => {
		setWidth(s);
	}, 300);

	if (!innerWidth) return null;

	return (
		//@ts-ignore
		<SplitPane
			split={direction}
			primary="first"
			className="react-resizer"
			resizerClassName={"react-resizable-handle"}
			onChange={handleChange}
			onDragStarted={handleDragStart}
			onDragFinished={handleDragEnd}
			maxSize={innerSize && innerSize * 0.98}
			minSize={innerSize && innerSize * 0.35}
			defaultSize={innerSize && innerSize * 0.5}
			size={width}
		>
			{children}
		</SplitPane>
	);
};

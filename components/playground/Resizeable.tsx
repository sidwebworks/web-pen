import SplitPane from "react-split-pane";
import { useResizeable } from "../../utils/hooks/use-resizeable";
import { debounce } from "../../utils";

export const Resizeable: React.FC<any> = ({ children, direction }) => {
	const { width, innerWidth, innerHeight, setWidth, setHeight } = useResizeable(direction);

	const isVertical = direction === "vertical";

	const innerSize = isVertical ? innerWidth : innerHeight;

	const handleDragStart = () => {
		document.body.classList.add("react-draggable-transparent-selection");
	};

	const handleDragEnd = debounce(() => {
		document.body.classList.remove("react-draggable-transparent-selection");
	});

	const handleChange = debounce((s: number) => {
		if (isVertical) {
			setWidth(s);
		} else {
			setHeight(s);
		}
	}, 250);

	if (!innerSize) return null;

	return (
		//@ts-ignore
		<SplitPane
			split={direction}
			className="react-resizer"
			resizerClassName={"react-resizable-handle"}
			onChange={handleChange}
			onDragStarted={handleDragStart}
			onDragFinished={handleDragEnd}
			maxSize={isVertical ? innerSize * 0.9 : innerSize * 0.99}
			minSize={isVertical ? innerSize * 0.3 : innerSize * 0.6}
			defaultSize={isVertical ? innerSize * 0.3 : innerSize * 0.98}
			size={width}
		>
			{children}
		</SplitPane>
	);
};

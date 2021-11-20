import SplitPane from "react-split-pane";
import { useResizeable } from "../../utils/hooks/use-resizeable";
import { debounce } from "../../utils";

export const Resizeable: React.FC<any> = ({ children }) => {
	const { width, innerWidth, setWidth } = useResizeable();

	const handleDragStart = () => {
		document.body.classList.add("react-draggable-transparent-selection");
	};

	const handleDragEnd = () => {
		document.body.classList.remove("react-draggable-transparent-selection");
	};

	const handleChange = debounce((s: number) => {
		setWidth(s);
	}, 250);

	if (!innerWidth) return null;

	return (
		//@ts-ignore
		<SplitPane
			split={"vertical"}
			minSize={innerWidth && innerWidth * 0.35}
			defaultSize={innerWidth && innerWidth * 0.5}
			size={width}
			primary="first"
			className="react-resizer"
			resizerClassName={"react-resizable-handle"}
			onChange={handleChange}
			onDragStarted={handleDragStart}
			onDragFinished={handleDragEnd}
		>
			{children}
		</SplitPane>
	);
};

import { ResizableBox } from "react-resizable";
import { ResizableProps } from "../../typings/interfaces";
import { useResizeable } from "../../utils/hooks/use-resizeable";

export const Resizeable: React.FC<ResizableProps> = ({
	direction,
	children,
	height = Infinity,
}) => {
	let resizableProps: ResizableProps = {};

	const { width, innerHeight, innerWidth, setWidth } = useResizeable();

	if (!innerHeight || !innerWidth) return null;

	if (direction === "horizontal") {
		resizableProps = {
			className: "resize-horizontal",
			minConstraints: [innerWidth! * 0.4, Infinity],
			maxConstraints: [innerWidth! * 0.75, Infinity],
			height: innerHeight,
			width,
			resizeHandles: ["e"],
			onResizeStop: (e, data) => {
				setWidth(data.size.width);
			},
		};
	} else {
		resizableProps = {
			minConstraints: [Infinity, 24],
			maxConstraints: [Infinity, innerWidth * 0.74],
			height: innerHeight,
			width: Infinity,
		};
	}

	return (
		//@ts-ignore
		<ResizableBox {...resizableProps}>
			<div className="flex flex-grow w-full h-full">{children}</div>
		</ResizableBox>
	);
};

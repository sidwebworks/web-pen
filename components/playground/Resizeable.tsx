import { memo, useRef, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import { ResizableProps } from "../../typings/interfaces";
import { useIsomorphicEffect } from "../../utils/hooks/use-isomorphic-effect";

export const Resizeable: React.FC<ResizableProps> = memo(({ direction, children }) => {
	let resizableProps: ResizableProps = {};

	const [height, setHeight] = useState(800);
	const [width, setWidth] = useState(800);

	useIsomorphicEffect(() => {
		let timer: any;

		const handler = () => {
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => {
				setWidth(window.innerWidth);
				setHeight(window.innerHeight);
			}, 200);
		};

		handler();

		window.addEventListener("resize", handler);

		return () => window.removeEventListener("resize", handler);
	}, []);

	if (direction === "horizontal") {
		resizableProps = {
			className: "resize-horizontal",
			minConstraints: [width * 0.2, Infinity],
			maxConstraints: [width * 0.75, Infinity],
			height: Infinity,
			width: width,
			resizeHandles: ["e"],
		};
	} else {
		resizableProps = {
			maxConstraints: [Infinity, height],
			height: height,
			width: Infinity,
		};
	}

	return (
		//@ts-ignore
		<ResizableBox {...resizableProps}>
			<div className="flex  flex-grow w-full h-full">{children}</div>
		</ResizableBox>
	);
});

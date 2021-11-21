import { useRef, useState } from "react";
import { useDebouncedState } from "./use-debounced-state";
import { useIsomorphicEffect } from "./use-isomorphic-effect";

export const useResizeable = (type) => {
	const [innerHeight, setInnerHeight] = useState<number>();
	const [width, setWidth] = useDebouncedState();
	const [height, setHeight] = useDebouncedState();
	const isVertical = type === "vertical";
	const [innerWidth, setInnerWidth] = useState<number>();
	const isInitialMount = useRef(true);

	useIsomorphicEffect(() => {
		let timer: any;

		const handler = () => {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				setInnerWidth(window.innerWidth);
				setInnerHeight(window.innerHeight);
				if (isVertical && window.innerWidth * 0.75 < width!) {
					setWidth(window.innerWidth * 0.75);
				} else if (window.innerHeight * 0.75 < height!) {
					setHeight(window.innerHeight * 0.75);
				}
			}, 100);
		};

		if (isInitialMount.current) {
			handler();
			if (isVertical) {
				setWidth(window.innerWidth / 2);
			} else {
				setHeight(window.innerHeight / 2);
			}
		}

		isInitialMount.current = false;

		window.addEventListener("resize", handler);

		return () => window.removeEventListener("resize", handler);
	}, [width]);

	return { innerHeight, height, setHeight, innerWidth, width, setWidth };
};

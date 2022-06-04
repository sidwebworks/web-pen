import { useState, useEffect, useRef } from "react";

export function useDebouncedState(initialValue?: any, timeout = 100) {
	const [value, setValue] = useState({ value: initialValue });
	const [debouncedValue, setDebouncedValue] = useState(initialValue);
	const handler = useRef<any>();

	useEffect(() => {
		handler.current = setTimeout(() => {
			setDebouncedValue(value.value);
		}, timeout);
		return () => {
			window.clearTimeout(handler.current);
		};
	}, [value, timeout]);

	return [
		// X
		debouncedValue,
		// setX
		(newValue: any) => {
			setValue({ value: newValue });
		},
		// setXImmediate
		(newValue: any) => {
			clearTimeout(handler.current);
			setDebouncedValue(newValue);
		},
		// cancelSetX
		() => clearTimeout(handler.current),
	];
}

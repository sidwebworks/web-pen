export function debounce(func: (e?: any) => void, timeout = 100) {
	let timer: NodeJS.Timeout;

	return (...args: any[]) => {
		clearTimeout(timer);

		timer = setTimeout(() => {
			// @ts-ignore
			func.apply(this, args);
		}, timeout);
	};
}

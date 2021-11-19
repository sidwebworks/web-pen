import clsx from "clsx";

export const ErrorComponent = ({ error }: { error: string }) => {
	return (
		<h1
			id="__PREVIEW_ERROR"
			className={clsx([
				error ? "absolute bottom-0 w-full bg-black text-red-500 p-2" : "invisible",
			])}
		>
			{error}
		</h1>
	);
};

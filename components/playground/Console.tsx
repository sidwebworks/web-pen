import clsx from "clsx";
import { Console } from "console-feed";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
export const ErrorComponent = ({ error }: { error: string }) => {
	return (
		<h1
			className={clsx([
				error ? "absolute bottom-0 w-full bg-black text-red-500 p-2" : "hidden",
			])}
		>
			{error}
		</h1>
	);
};

export const ConsoleComponent = () => {
	const logs = useSelector<RootState, { data: any; method: string }[]>((s) => s.code.logs);

	return (
		<div className="relative bg-gray-800 pt-5 ">
			<div className="absolute -top-2 inset-x-0 max-w-xs mx-auto bg-gray-800 h-4 rounded-t-full" />
			<Console
				styles={{
					BASE_BACKGROUND_COLOR: "#27272A",
					BASE_COLOR: "#27272A",
					LOG_ERROR_BACKGROUND: "#27272A",
					LOG_BACKGROUND: "#27272A",
					LOG_RESULT_BACKGROUND: "#27272A",
				}}
				variant="dark"
				logs={logs}
			/>
		</div>
	);
};

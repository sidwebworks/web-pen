import clsx from "clsx";
import { Console } from "console-feed";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

export const ConsoleComponent = () => {
	const logs = useSelector<RootState, any[]>((s) => s.code.logs);

	return (
		<div className="relative bg-gray-900 pt-3 ">
			<div className="absolute -top-2 inset-x-0 max-w-xs mx-auto bg-gray-900 h-4 rounded-t-full" />
			<div className="w-full max-h-[47.5vh] bg-scroll overflow-y-auto">
			<Console
				styles={{
					BASE_BACKGROUND_COLOR: "#18181B",
					LOG_ERROR_BORDER: "red",
					LOG_ERROR_COLOR: "red",
					LOG_ERROR_ICON: " red",
					LOG_ERROR_BACKGROUND: "#18181B",
					BASE_COLOR: "gray",
					LOG_BACKGROUND: "#18181B",
					LOG_RESULT_BACKGROUND: "#18181B",
					
				}}
				variant="dark"
				logs={logs}
			/>
			</div>
		</div>
	);
};

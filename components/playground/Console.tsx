import clsx from "clsx";
import { Console } from "console-feed";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { Trash2 } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { CLEAR_LOGS } from "../../redux/actions/editor.actions";

export const ConsoleComponent = () => {
	const logs = useSelector<RootState, any[]>((s) => s.editor.console);
	const dispatch = useDispatch();

	const handleClear = () => dispatch(CLEAR_LOGS());

	return (
		<div className="relative bottom-0 bg-gray-900 group pt-3 ">
			<div className="absolute -top-3 text-sm text-gray-500 inset-x-0  transition-opacity duration-200 ease-in-out group-hover:opacity-0  text-center max-w-xs mx-auto bg-gray-900 h-4 rounded-t-full">
				console
			</div>
			<button
				onClick={handleClear}
				title="clear console"
				className="block ml-auto mx-3 mb-2"
			>
				<Trash2 className="w-4  h-4 text-red-500" />
			</button>

			<div className="w-full  flex flex-col flex-grow max-h-[220px]	 h-full overflow-auto">
				<Console
					styles={{
						BASE_BACKGROUND_COLOR: "#18181B",
						LOG_ERROR_BORDER: "red",
						LOG_ERROR_COLOR: "red",
						LOG_ERROR_ICON: " red",
						ARROW_FONT_SIZE: "16px",
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

import clsx from "clsx";
import { Console } from "console-feed";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { AlertCircle, HelpCircle, Trash2 } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { CLEAR_LOGS } from "../../redux/actions/editor.actions";

export const ConsoleComponent = () => {
	const logs = useSelector<RootState, any[]>((s) => s.editor.console);
	const dispatch = useDispatch();

	const handleClear = () => dispatch(CLEAR_LOGS());

	return (
		<div className="relative bottom-0 right-0 z-20 bg-gray-900 group">
			<div className="flex items-center justify-end px-3 pt-1.5">
				<AlertCircle className="w-4 h-4 mr-3 text-red-500" />
				<HelpCircle className="w-4 h-4 text-blue-500" />
			</div>

			<button onClick={handleClear} title="clear console" className="block mt-2 ml-2 mr-auto">
				<Trash2 className="w-4 h-4 text-red-500" />
			</button>
			<div className="w-full pt-2 flex flex-col flex-grow max-h-[220px]	 h-full overflow-auto">
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

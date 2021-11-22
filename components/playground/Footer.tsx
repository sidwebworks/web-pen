import { AlignLeft, BatteryCharging, Pause, Zap } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";

export const FooterPanel = () => {
	const isBundling = useSelector<RootState, any>((s) => s.bundler.isBundling);
	const isInitialized = useSelector<RootState, any>((s) => s.bundler.initialized);

	return (
		<div className="w-full bg-gray-900 absolute inset-x-0 bottom-0 flex justify-between px-3 py-1  items-center flex-grow ">
			<div className="max-w-sm flex items-center ">
				{(isBundling || !isInitialized) ? <Loader /> : <BatteryCharging className="h-4 w-4 mr-2 text-gray-500 "/>}
				<span className="block py-0.5 text-xs  text-gray-500">
					Bundler state:{" "}
					<span className="text-cyan-500">{!isInitialized ? "Initializing..." : isBundling ? "Bundling..." : "Idle"}</span>
				</span>
			</div>
		</div>
	);
};

const Loader = () => {
	return (
		<svg
			className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx={12}
				cy={12}
				r={10}
				stroke="currentColor"
				strokeWidth={4}
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	);
};

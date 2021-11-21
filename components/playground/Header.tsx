import { useMonaco } from "@monaco-editor/react";
import clsx from "clsx";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { SWITCH_FILE } from "../../redux/actions/code.actions";
import { ConsoleComponent } from "./Console";

export const HeaderPanel = ({ formatCode }: any) => {
	return (
		<div className="w-full bg-gray-900 flex justify-between px-5 border-b-2 border-trueGray-700 items-center flex-grow ">
			<Tabs />
			{/* <button onClick={formatCode} className="rounded-full btn-sm btn-success" role="button">
				Format
			</button> */}

		</div>
	);
};

export const Tabs = () => {
	const active = useSelector<RootState, any>((s) => s.code.active_tab);
	const files = useSelector<RootState, any>((s) => s.code.files);

	return (
		<div className="flex items-center   relative z-10 gap-x-4">
			{files.map((el: any) => (
				<Tab label={el.filename} key={el.filename} isActive={active === el.filename} />
			))}
			{/* <button className="btn btn-sm btn-info">JS</button>
			<button className="btn btn-sm btn-info">CSS</button> */}
		</div>
	);
};

const Tab = ({ label, isActive, current }: any) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		if (isActive) return;
		dispatch(SWITCH_FILE(label));
	};

	return (
		<button
			onClick={handleClick}
			className={clsx([
				" py-2 text-sm border-b-2 transition-all duration-200 ease-in-out mb-[-2.5px] font-medium",
				isActive
					? " border-cyan-500 text-cyan-600 "
					: " border-trueGray-700 text-trueGray-600 hover:text-opacity-40 ",
			])}
		>
			{label}
		</button>
	);
};

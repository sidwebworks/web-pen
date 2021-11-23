import clsx from "clsx";
import { memo } from "react";
import { AlignLeft, Zap } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import { SWITCH_FILE } from "../../redux/actions/editor.actions";
import { debounce } from "../../utils";
import { useActions } from "../../utils/hooks/use-actions";

export const HeaderPanel = memo(({ formatCode }: any) => {
	const dispatch = useDispatch();

	const runCode = () => {
		let timer = setTimeout(() => {
			dispatch(CREATE_BUNDLE());
		}, 50);
		return () => clearTimeout(timer);
	};

	return (
		<div className="w-full h-[2.44rem] bg-gray-900 flex justify-between px-5 border-b-2  border-trueGray-700 items-center flex-grow ">
			<Tabs />
			<div className="max-w-sm flex items-center gap-4">
				<button
					aria-label="format code"
					title="format code"
					onClick={formatCode}
					className="rounded-full btn btn-xs border-0 bg-gray-800"
					role="button"
				>
					<AlignLeft className="w-5 h-5 stroke-current text-green-400" />
				</button>
				<button
					aria-label="bundle code"
					title="bundle code"
					onClick={runCode}
					className="rounded-full btn  btn-xs border-0 bg-gray-800"
					role="button"
				>
					<Zap className="w-4 h-4 fill-current text-cyan-400" />
				</button>
			</div>
		</div>
	);
});

export const Tabs = () => {
	const active_file = useActions<any>((s) => s.editor.active_file);

	const files = [
		{ name: "index.html", lang: "html" },
		{ name: "app.js", lang: "javascript" },
		{ name: "styles.css", lang: "css" },
	];

	return (
		<div className="flex items-center   relative z-10 gap-x-4">
			{files.map((file: any) => (
				<Tab
					label={file.name}
					key={file.name}
					files={files}
					isActive={file.name === active_file.name}
				/>
			))}
		</div>
	);
};

const Tab = ({ label, isActive, files }: any) => {
	const current = files.find((el) => el.name === label);

	const dispatch = useDispatch();

	const handleClick = () => {
		if (isActive) return;
		dispatch(SWITCH_FILE(current));
	};

	return (
		<button
			onClick={handleClick}
			title={label}
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

import clsx from "clsx";
import { memo, useCallback, useMemo } from "react";
import { AlignLeft, Zap } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import { SWITCH_FILE } from "../../redux/actions/editor.actions";
import { useTypedSelector } from "../../utils/hooks/use-actions";

export const HeaderPanel: React.FC<{ onFormat: any }> = memo(({ onFormat }) => {
	const dispatch = useDispatch();

	const active_file = useTypedSelector<any>((s) => s.editor.active_file);

	const runCode = useCallback(() => {
		let timer = setTimeout(() => {
			dispatch(CREATE_BUNDLE());
		}, 50);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="w-full h-[2.44rem] bg-gray-900 flex justify-between px-5 border-b-2  border-trueGray-700 items-center flex-grow ">
			<Tabs active_file={active_file} />
			<div className="max-w-sm flex items-center gap-4">
				<button
					onClick={onFormat}
					aria-label="format code"
					title="format code"
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

HeaderPanel.displayName = "HeaderPanel";

export const Tabs = ({ active_file }) => {
	const filesObj = useTypedSelector<any[]>((s) => s.editor.files);
	const files = Object.keys(filesObj);

	return (
		<div className="flex items-center relative z-10 gap-x-4">
			{files.map((file: any) => (
				<Tab
					name={filesObj[file].filename}
					key={file}
					lang={filesObj[file].language}
					type={file}
					isActive={filesObj[file].filename === active_file.name}
				/>
			))}
		</div>
	);
};

const Tab = ({ name, isActive, lang, type }: any) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		if (isActive) return;
		dispatch(SWITCH_FILE({ lang, name, type }));
	};

	return (
		<button
			onClick={handleClick}
			title={name}
			className={clsx([
				" py-2 text-sm border-b-2 transition-all duration-200 ease-in-out mb-[-2.5px] font-medium",
				isActive
					? " border-cyan-500 text-cyan-600 "
					: " border-trueGray-700 text-trueGray-600 hover:text-opacity-40 ",
			])}
		>
			{name}
		</button>
	);
};

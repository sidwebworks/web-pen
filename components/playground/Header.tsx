import clsx from "clsx";
import { memo, useCallback, useState } from "react";
import { AlignLeft, Settings, Zap } from "react-feather";
import { useDispatch } from "react-redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import { SWITCH_FILE } from "../../redux/actions/editor.actions";
import { useTypedSelector } from "../../utils/hooks/use-actions";
import { SettingsModal } from "./SettingsModal";

export const HeaderPanel: React.FC<{ onFormat: any }> = memo(({ onFormat }) => {
	const dispatch = useDispatch();

	const active_file = useTypedSelector<any>((s) => s.editor.active_file);
	const [isOpen, setIsOpen] = useState(false);

	const runCode = useCallback(() => {
		let timer = setTimeout(() => {
			dispatch(CREATE_BUNDLE());
		}, 50);

		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<SettingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
			<div className="w-full h-[2.44rem] bg-gray-900 flex gap-x-3 px-4 border-b-2  border-trueGray-700 items-center flex-grow ">
				<button
					// onClick={() => setIsOpen(e => !e)}
					aria-label="format code"
					title="format code"
					className="rounded-full "
					role="button"
				>
					<Settings className="w-4 h-4 mr-2 text-gray-400 stroke-current" />
				</button>
				<Tabs active_file={active_file} />
				<div className="flex items-center max-w-sm gap-4 ml-auto">
					<button
						onClick={onFormat}
						aria-label="format code"
						title="format code"
						className="bg-gray-800 border-0 rounded-full btn btn-xs"
						role="button"
					>
						<AlignLeft className="w-5 h-5 text-green-400 stroke-current" />
					</button>
					<button
						aria-label="bundle code"
						title="bundle code"
						onClick={runCode}
						className="bg-gray-800 border-0 rounded-full btn btn-xs"
						role="button"
					>
						<Zap className="w-4 h-4 fill-current text-cyan-400" />
					</button>
				</div>
			</div>
		</>
	);
});

HeaderPanel.displayName = "HeaderPanel";

export const Tabs = ({ active_file }) => {
	const filesObj = useTypedSelector<any[]>((s) => s.editor.files);
	const files = Object.keys(filesObj);

	return (
		<div className="relative z-10 flex items-center gap-x-4">
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

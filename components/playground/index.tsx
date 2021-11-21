import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import {
	UPDATE_BUNDLE, UPDATE_ERROR
} from "../../redux/actions/code.actions";
import bundler from "../../utils/bundler";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { Resizeable } from "./Resizeable";

const Playground = () => {
	const unBundled = useSelector<RootState, any>(
		(s) => s.code.files.find((el) => el.language === "javascript")!.value
	);
	const dispatch = useDispatch();

	useEffect(() => {
		const timeout = setTimeout(async () => {
			const { code, err } = await bundler(unBundled);
			dispatch(UPDATE_BUNDLE(code));
			dispatch(UPDATE_ERROR(err || null));
		}, 600);

		return () => clearTimeout(timeout);
	}, [unBundled]);

	return (
		<>
			<div className="flex flex-row flex-grow h-full">
				<Resizeable direction="vertical">
					<Editor />
					<Preview />
				</Resizeable>
			</div>
		</>
	);
};

export default Playground;

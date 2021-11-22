import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import bundler from "../../utils/bundler";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { Resizeable } from "./Resizeable";

const Playground = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(CREATE_BUNDLE());
	}, []);

	return (
		<>
			<div className="flex flex-row flex-grow min-h-screen max-h-screen">
				<Resizeable direction="vertical">
					<Editor />
					<Preview />
				</Resizeable>
			</div>
		</>
	);
};

export default Playground;

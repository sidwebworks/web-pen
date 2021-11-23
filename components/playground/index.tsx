import dynamic from "next/dynamic";
import { Preview } from "./Preview";
import { Resizeable } from "./Resizeable";
const Editor = dynamic(() => import("./Editor"));

const Playground = () => {

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

import dynamic from "next/dynamic";
import { FooterPanel } from "./Footer";
import { Preview } from "./Preview";
import { Resizeable } from "./Resizeable";
const Editor = dynamic(() => import("./Editor"));

const Playground = () => {
	return (
		<>
			<div className="flex flex-col flex-grow h-full max-h-screen min-h-screen ">
				<Resizeable direction="vertical">
					<Editor />
					<Preview />
				</Resizeable>
				<FooterPanel />
			</div>
		</>
	);
};

export default Playground;

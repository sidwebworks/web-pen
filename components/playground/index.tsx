import { Dispatch, memo, SetStateAction } from "react";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { Resizeable } from "./Resizeable";

interface CodeCellProps {
	output: string;
	setCode: Dispatch<SetStateAction<string>>;
	initialSnippet: string;
}

export const CodeLayout: React.FC<CodeCellProps> = memo(
	({ output, setCode, initialSnippet }) => {
		return (
			<Resizeable direction="vertical">
				<div className="flex flex-grow h-full flex-row">
					<Resizeable direction="horizontal">
						<Editor onChange={setCode} intialValue={initialSnippet} />
					</Resizeable>

					<Preview code={output} />
				</div>
			</Resizeable>
		);
	}
);

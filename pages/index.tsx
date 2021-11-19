import type { NextPage } from "next";
import { Fragment, useEffect, useMemo } from "react";
import { createContext, useState } from "react";
import { Editor, OptionsPanel } from "../components/playground/Editor";
import { Preview } from "../components/playground/Preview";
import { Resizeable } from "../components/playground/Resizeable";
import { ICodeEditor } from "../typings/types";

import bundler from "../utils/bundler";

const initialSnippet = `
import react from "react"
`;

export const CodeBoxContext = createContext<{
	editor: ICodeEditor | null;
	setEditor: (value: any) => void;
}>({ editor: null, setEditor: (value: any) => {} });

export const CodeBoxProvider: React.FC = (props) => {
	const [editor, setEditor] = useState<ICodeEditor | null>(null);

	const value = useMemo(() => ({ editor, setEditor }), [editor]);

	return <CodeBoxContext.Provider value={value}>{props.children}</CodeBoxContext.Provider>;
};

const Home: NextPage = () => {
	const [code, setCode] = useState("");
	const [output, setOutput] = useState("");

	useEffect(() => {
		const timeout = setTimeout(async () => {
			const result = await bundler(code);
			setOutput(result);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [code]);

	return (
		<main className="bg-gray-800 min-h-screen max-h-screen overflow-y-hidden">
			<CodeBoxProvider>
				<OptionsPanel />
				<Resizeable direction="vertical">
					<Resizeable direction="horizontal">
						<Editor onChange={setCode} intialValue={initialSnippet} />
					</Resizeable>
					<Preview code={output} />
				</Resizeable>
			</CodeBoxProvider>
		</main>
	);
};

export default Home;

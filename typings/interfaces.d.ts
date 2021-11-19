import { ResizableBoxProps } from "react-resizable";

export interface CodeEditorProps {
	intialValue: string;
	onChange: (fn: any) => void;
}

export interface ResizableProps extends Partial<ResizableBoxProps> {
	direction?: "horizontal" | "vertical";
}

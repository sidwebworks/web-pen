import { ResizableBoxProps } from "react-resizable";

export interface CodeEditorProps {
	intialValue: string;
}

export interface ResizableProps extends Partial<ResizableBoxProps> {
	direction?: "horizontal" | "vertical";
}

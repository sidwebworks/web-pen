import { DirectoryTypes } from "./types";

export interface CodeEditorProps {
  intialValue: string;
}

interface Item {
  id: string;
  path: string;
  parent?: string;
  name: string;
  createdAt: string;
}

export type File = Item & {
  content: string;
  mimeType: string;
};

export type Directory = Item & {
  type: DirectoryTypes;
  children: (File | Directory)[];
  isOpen: boolean;
};

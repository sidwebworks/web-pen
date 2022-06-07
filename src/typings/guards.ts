import { File } from "./editor";

export function isFile(item: any): item is File {
  return typeof item.content === "string";
}

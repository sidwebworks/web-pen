import { File } from "./editor";


export function isFile(item: any): item is File {
  return typeof item.content === "string";
}

declare module "react" {
  interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  }
}
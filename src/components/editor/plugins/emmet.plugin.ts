import { MonacoPlugin } from "@typings/types";
import { Dispose, emmetCSS, emmetHTML } from "emmet-monaco-es";

const plugin: MonacoPlugin = (_, monaco) => {
  const disposables: Dispose[] = [];

  disposables.push(emmetHTML(monaco, ["html"]));

  disposables.push(emmetCSS(monaco, ["css"]));

  return {
    dispose() {
      disposables.forEach((disposable) => {
        disposable();
      });
    },
  };
};

export default plugin;

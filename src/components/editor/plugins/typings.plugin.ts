import { Monaco } from "@monaco-editor/react";
import { IDisposable } from "@typings/types";
import { Dispose, emmetCSS, emmetHTML } from "emmet-monaco-es";

const plugin = (monaco: Monaco) => {
  const disposables: IDisposable[] = [];
  let worker;

  const dependencies = {
    react: "@latest",
    "react-dom": "@latest",
    axios: "@latest",
  };

  if (!worker) {
    worker = new Worker(new URL("/workers/fetch-types.worker.js"));
  }

  Object.keys(dependencies).forEach((name) => {
    worker.postMessage({
      name,
      version: dependencies[name],
    });
  });

  worker.addEventListener("message", (event) => {
    // name,
    // version,
    // typings: result,
    const key = `node_modules/${event.data.name}/index.d.ts`;
    const source = event.data.typings[key];

    // const path = `${MONACO_LIB_PREFIX}${event.data.name}`;
    const libUri = `file:///node_modules/@types/${event.data.name}/index.d.ts`;

    disposables.push(
      monaco.languages.typescript.javascriptDefaults.addExtraLib(source, libUri)
    );
    disposables.push(
      monaco.languages.typescript.typescriptDefaults.addExtraLib(source, libUri)
    );

    // When resolving definitions and references, the editor will try to use created models.
    // Creating a model for the library allows "peek definition/references" commands to work with the library.
  });

  return {
    dispose() {
      disposables.forEach((disposable) => {
        disposable.dispose();
      });
      if (worker) {
        worker.terminate();
      }
    },
  };
};

export default plugin;

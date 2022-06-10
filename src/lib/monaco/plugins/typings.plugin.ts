import { Monaco } from "@monaco-editor/react";
import { IDisposable } from "@typings/editor";
import { START_TYPE_FETCH, STOP_TYPE_FETCH } from "src/lib/store/slices/editor";
import store from "src/lib/store/store";

const plugin = (monaco: Monaco, deps: Record<string, string>) => {
  const disposables: IDisposable[] = [];
  let worker: Worker;

  if (!worker) {
    worker = new Worker(
      new URL("../../../../workers/fetch-types.worker.js", import.meta.url)
    );
  }

  let count = 0;

  const stop = () => {
    store.dispatch(STOP_TYPE_FETCH());
  };

  let timeout: void | NodeJS.Timeout = setTimeout(stop, 2500);

  store.dispatch(START_TYPE_FETCH());

  Object.keys(deps).forEach((name) => {
    count++;
    worker.postMessage({
      name,
      version: deps[name],
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

    count--;
    if (count < 1) {
      stop();
    } else {
      timeout = setTimeout(stop, 2500);
    }

    // When resolving definitions and references, the editor will try to use created models.
    // Creating a model for the library allows "peek definition/references" commands to work with the library.
  });

  return {
    dispose() {
      disposables.forEach((disposable) => {
        disposable.dispose();
      });

      if (timeout) {
        timeout = clearTimeout(timeout);
      }

      if (worker) {
        count = 0;
        stop();
        worker.terminate();
      }
    },
  };
};

export default plugin;



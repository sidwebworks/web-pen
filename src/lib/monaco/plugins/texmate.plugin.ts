import { loadWASM } from "onigasm"; // peer dependency of 'monaco-textmate'
import { Registry } from "monaco-textmate"; // peer dependency
import { wireTmGrammars } from "monaco-editor-textmate";
import { Monaco } from "@monaco-editor/react";
import { ICodeEditor } from "@typings/editor";

const registry = new Registry({
  getGrammarDefinition: async (name) => {
    switch (name) {
      case "source.css":
        return {
          format: "json",
          content: await (await fetch(`/grammars/css.tmGrammar.json`)).text(),
        };
      case "source.ts":
        return {
          format: "json",
          content: await (
            await fetch(`/grammars/TypeScriptReact.tmLanguage.json`)
          ).json(),
        };
      case "source.js":
        return {
          format: "json",
          content: await(
            await fetch(`/grammars/JavaScriptReact.tmLanguage.json`)
          ).json(),
        };

      default:
        return {
          format: "json",
          content: await (
            await fetch(`/grammars/JavaScript.tmLanguage.json`)
          ).json(),
        };
    }
  },
});

let loaded = false;

const plugin = async (editor: ICodeEditor, monaco: Monaco) => {
  if (!loaded) {
    await loadWASM(`/onigasm.wasm`);
    loaded = true;
  }

  // map of monaco "language id's" to TextMate scopeNames
  const grammars = new Map();

  grammars.set("css", "source.css");
  grammars.set("javascript", "source.js");
  grammars.set("typescript", "source.ts");

  await wireTmGrammars(monaco, registry, grammars, editor);
};

export default plugin;

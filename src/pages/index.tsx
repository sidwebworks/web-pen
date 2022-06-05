import Header from "@components/header";
import { useBundler } from "@hooks/use-bundler";
import { useEventListener } from "@hooks/use-event-listener";
import { OnMount } from "@monaco-editor/react";
import { ICodeEditor } from "@typings/types";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useRef } from "react";
import FileTree from "../components/file-tree";
import Footer from "../components/footer";
import { SplitLayout } from "../components/split-layout";
import { useTypedDispatch } from "../utils/store/store";
import { INIT_BUNDLER } from "../utils/store/thunks";

const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

const Preview = dynamic(() => import("../components/preview"), {
  ssr: false,
});

const Home: NextPage = () => {
  const dispatch = useTypedDispatch();
  const editorRef = useRef<ICodeEditor | null>(null);
  const { build } = useBundler();

  useEventListener("keydown", (e) => {
    if (
      e.key === "s" &&
      (navigator.userAgent.match("Mac") ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault();
    }
  });

  useEffect(() => {
    dispatch(INIT_BUNDLER());
  }, [dispatch]);

  const onMount: OnMount = async (editor) => {
    editorRef.current = editor;

    editor.onDidChangeModel(() => {
      editor.getAction("editor.action.formatDocument").run();
    });
  };

  const handleFormat = async () => {
    if (!editorRef.current) return;

    editorRef.current.getAction("editor.action.formatDocument")?.run();
  };

  return (
    <main className="max-h-screen min-h-screen flex bg-dark-900">
      <Head>
        <title>Web Pen</title>
      </Head>
      <FileTree />
      <div className="flex flex-col w-full items-center">
        <Header onFormat={handleFormat} onBundle={build} />
        <SplitLayout.Root>
          <SplitLayout.Pane id="editor">
            <Editor onMount={onMount} />
          </SplitLayout.Pane>
          <SplitLayout.Pane id="preview">
            <Preview />
          </SplitLayout.Pane>
        </SplitLayout.Root>
        <Footer />
      </div>
    </main>
  );
};

export default Home;

import { useEditorDisposables } from "@hooks/use-editor-disposables";
import FileTree from "@components/file-tree";
import Footer from "@components/footer";
import Header from "@components/header";
import { SplitLayout } from "@components/split-pane";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import { INIT_BUNDLER, LOAD_INITIAL_FILES } from "src/lib/store/thunks";
import { useEditor } from "@hooks/use-editor";
import { useBundler } from "@hooks/use-bundler";
import { SET_ACTIVE_TAB } from "src/lib/store/slices/editor";
import { useRouter } from "next/router";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

const Preview = dynamic(() => import("../preview"), {
  ssr: false,
});

interface EditorLayoutProps {}

const EditorLayout: React.FC<EditorLayoutProps> = () => {
  const files = useTypedSelector((s) => s.editor.dir);
  const { build } = useBundler();
  const router = useRouter();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(LOAD_INITIAL_FILES(router.query?.pid as string)).then(() => {
      build();
    });

    dispatch(INIT_BUNDLER());
  }, [dispatch, build, router]);

  useEditorDisposables();

  return (
    <main className="max-h-screen min-h-screen flex bg-dark-900">
      <FileTree files={files} />
      <div className="flex flex-col w-full items-center">
        <Header />
        <SplitLayout.Root>
          <SplitLayout.Pane id="editor">
            <Editor />
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

export default EditorLayout;

import FileTree from "@components/file-tree";
import Footer from "@components/footer";
import Header from "@components/header";
import SettingsModal from "@components/settings-modal";
import { SplitLayout } from "@components/split-pane";
import { useBundler } from "@hooks/use-bundler";
import { useEditorDisposables } from "@hooks/use-editor-disposables";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import { INIT_BUNDLER, LOAD_INITIAL_FILES } from "src/lib/store/thunks";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

const Preview = dynamic(() => import("../preview"), {
  ssr: false,
});

interface EditorLayoutProps {}

const EditorLayout: React.FC<EditorLayoutProps> = () => {
  const files = useTypedSelector((s) => s.editor.dir);
  const isInitialized = useTypedSelector((s) => s.bundler.isInitialized);
  const isOpen = useTypedSelector((s) => s.editor.isSidebarOpen);
  const { build } = useBundler();
  const router = useRouter();
  const dispatch = useTypedDispatch();

  const id = router.query?.pid as string;

  useEffect(() => {
    dispatch(LOAD_INITIAL_FILES(id))
      .then(() => dispatch(INIT_BUNDLER()))
      .then(() => build());
  }, [dispatch, build, id, isInitialized]);

  useEditorDisposables();

  return (
    <main className="max-h-screen min-h-screen bg-dark-900">
      <SettingsModal />
      <Header />
      <SplitLayout.Root
        maxSize={1.2}
        fillParent
        className="h-[calc(100vh-41px)]"
        size={isOpen ? undefined : 0}
        defaultSize={140}
        minSize={10.1}
      >
        <SplitLayout.Pane id="file-tree">
          <FileTree files={files} />
        </SplitLayout.Pane>
        <SplitLayout.Pane id="editor-view-contents">
          <div className="flex flex-col w-full h-full items-center">
            <SplitLayout.Root fillParent maxSize={3} minSize={5}>
              <SplitLayout.Pane id="editor">
                <Editor />
              </SplitLayout.Pane>
              <SplitLayout.Pane id="preview">
                <Preview />
              </SplitLayout.Pane>
            </SplitLayout.Root>
            <Footer />
          </div>
        </SplitLayout.Pane>
      </SplitLayout.Root>
    </main>
  );
};

export default EditorLayout;

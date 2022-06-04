import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import FileTree from "../components/file-tree";
import Footer from "../components/footer";
import { Header } from "../components/header";
import Preview from "../components/preview";
import { SplitLayout } from "../components/split-layout";

const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <main className="max-h-screen min-h-screen flex bg-dark-900">
      <Head>
        <title>Web Pen</title>
      </Head>
      <FileTree />
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

export default Home;

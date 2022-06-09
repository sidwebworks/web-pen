import { useEventListener } from "@hooks/common";
import { EditorProvider } from "@hooks/use-editor";
import NextProgress from "next-progress";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment } from "react";
import { Provider } from "react-redux";
import { isMac } from "src/lib";
import "windi.css";
import store from "../lib/store/store";
import "../styles/global.css";

function App({ Component, pageProps }: AppProps) {
  useEventListener("keydown", (ev: KeyboardEvent) => {
    const isPrint = ev.key === "p";
    const isSave = ev.key === "s";
    if ((isSave || isPrint) && (isMac() ? ev.metaKey : ev.ctrlKey)) {
      ev.preventDefault();
    }
  });

  return (
    <Fragment>
      <Head>
        <title>Web Pen</title>
      </Head>
      <Provider store={store}>
        <NextProgress color="#27D3CF" options={{ showSpinner: true }} />
        <EditorProvider>
          <Component {...pageProps} />
        </EditorProvider>
      </Provider>
    </Fragment>
  );
}

export default App;

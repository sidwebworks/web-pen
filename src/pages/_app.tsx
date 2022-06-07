import "windi.css";
import "../styles/global.css";
import { EditorProvider } from "@hooks/use-editor";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { Provider } from "react-redux";
import { isMac } from "src/lib";
import store from "../lib/store/store";
import { useEventListener } from "@hooks/common";
import { Router, useRouter } from "next/router";
import { nanoid } from "@reduxjs/toolkit";

function App({ Component, pageProps }: AppProps) {
  const { query, push } = useRouter();

  useEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "s" && (isMac() ? ev.metaKey : ev.ctrlKey)) {
      ev.preventDefault();

      const id = query?.pid;

      console.log(id);

      if (!id) {
        const url = `/editor?pid=${nanoid()}`;
        push(url, url, { shallow: true });
      }
    }
  });

  return (
    <Fragment>
      <Head>
        <title>Web Pen</title>
      </Head>
      <Provider store={store}>
        <EditorProvider>
          <Component {...pageProps} />
        </EditorProvider>
      </Provider>
    </Fragment>
  );
}

export default App;

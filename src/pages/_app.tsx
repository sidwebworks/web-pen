import type { AppProps } from "next/app";
import { Provider } from "jotai";
import "windi.css";
import "../styles/global.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;

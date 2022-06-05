import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import "windi.css";
import { EditorModelsProvider } from "../hooks/use-editor-models";
import { FileSystemProvider } from "../hooks/use-filesystem";
import store from "../utils/store/store";
import "../styles/global.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <FileSystemProvider>
        <EditorModelsProvider>
          <Component {...pageProps} />
        </EditorModelsProvider>
      </FileSystemProvider>
    </Provider>
  );
}

export default App;

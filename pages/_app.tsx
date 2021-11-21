import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux";
import "../styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;

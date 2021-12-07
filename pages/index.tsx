import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const Playground = dynamic(() => import("../components/playground"), { ssr: false });

const Home: NextPage = () => {
	return (
		<main className="max-h-screen min-h-screen bg-gray-900">
			<Head>
				<title>Web Pen</title>
			</Head>
			<Playground />
		</main>
	);
};

export default Home;

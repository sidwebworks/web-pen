import type { NextPage } from "next";
import dynamic from "next/dynamic";
const Playground = dynamic(() => import("../components/playground"), { ssr: false });

const Home: NextPage = () => {
	return (
		<main className="max-h-screen min-h-screen overflow-y-hidden bg-gray-800">
			<Playground />
		</main>
	);
};

export default Home;

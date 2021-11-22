import type { NextPage } from "next";
import dynamic from "next/dynamic";
const Playground = dynamic(() => import("../components/playground"), { ssr: false });

const Home: NextPage = () => {
	return (
		<main className="max-h-screen min-h-screen  bg-gray-900">
			<Playground />
		</main>
	);
};

export default Home;

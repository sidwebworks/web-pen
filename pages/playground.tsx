import localforage from "localforage";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const fileCache = localforage.createInstance({
	name: "filecache",
});

const Home: NextPage = () => {
	useEffect(() => {
		fileCache
			.iterate(function (value, key, iterationNumber) {
                console.log('key: ', key);
				let uri = new URL(key);
				console.log("uri: ", uri.pathname.split("/"));
			})
			.then(function () {
				console.log("Iteration has completed");
			});
	}, []);
	return <main className="max-h-screen min-h-screen  bg-gray-900"></main>;
};

export default Home;

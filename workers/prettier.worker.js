import prettier from "prettier";

const options = {
	html: async () => ({
		parser: "html",
		plugins: [await import("prettier/parser-html")],
		printWidth: 120,
	}),

	javascript: async () => ({
		parser: "babel",
		plugins: [await import("prettier/parser-babel")],
		printWidth: 90,
		semi: true,
		parser: "babel",
		useTabs: true,
		singleQuote: true,
	}),
};

let current;

addEventListener("message", async (event) => {
	if (event.data._current) {
		current = event.data._current;
		return;
	}

	function respond(data) {
		setTimeout(() => {
			if (event.data._id === current) {
				postMessage({ _id: event.data._id, ...data });
			} else {
				postMessage({ _id: event.data._id, canceled: true });
			}
		}, 0);
	}

	const opts = await options[event.data.language]();

	try {
		respond({
			pretty: prettier.format(event.data.text, opts),
		});
	} catch (error) {
		respond({ error });
	}
});

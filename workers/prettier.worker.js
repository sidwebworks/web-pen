import prettier from "prettier";

let current;

const options = {
  html: async () => ({
    parser: "html",
    useTabs: true,
    plugins: [await import("prettier/parser-html")],
    printWidth: 90,
  }),

  css: async () => ({
    parser: "css",
    useTabs: true,
    plugins: [await import("prettier/parser-postcss")],
    printWidth: 100,
  }),

  javascript: async () => ({
    parser: "babel",
    plugins: [await import("prettier/parser-babel")],
    printWidth: 100,
    semi: true,
    useTabs: true,
    singleQuote: true,
  }),
  typescript: async () => ({
    parser: "babel",
    plugins: [await import("prettier/parser-babel")],
    printWidth: 100,
    semi: true,
    useTabs: true,
    singleQuote: true,
  }),
};

addEventListener("message", async (event) => {
  console.log(event);
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

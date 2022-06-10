import { template } from "lodash-es";

const templates = {
  js: template(`
<script type="module">
  const handleError = (err) => {
    console.error(err)
    parent.postMessage({ error: err.toString() }, "*")
  }

  window.addEventListener("error", (ev) => {
    ev.preventDefault()
    handleError(ev.error)
  })

  window.addEventListener("message", (ev) => {
    if (!ev.data?.code) return
    try {
      eval(ev.data.code)
      parent.postMessage({ error: "" }, "*")
    } catch (error) {
      handleError(error)
    }
  }, false)
</script>`),
  css: template(`<style> <%- code %> </style>`),
};

const CSS_REGEX = new RegExp(
  /(?<=<!--STYLES INJECTED BY WEBPEN-->)(.*)(?=<!--STYLES INJECTED BY WEBPEN-->)/gms
);

const JS_REGEX = new RegExp(
  /(?<=<!--SCRIPT INJECTED BY WEBPEN-->)(.*)(?=<!--SCRIPT INJECTED BY WEBPEN-->)/gms
);

export const createSnippet = ({
  html = "",
  css = "",
}: {
  html: string;
  css: string;
}) => {
  const output = html
    .replace(JS_REGEX, templates.js())
    .replace(CSS_REGEX, templates.css({ code: css }));

  return output;
};




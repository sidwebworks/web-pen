import { template } from "lodash-es";

const templates = {
  js: template(`
  <script type="module" async>
    function createUri(raw) {
      const blob = new Blob([String.raw({raw})], {type: 'text/javascript'})
      const uri = URL.createObjectURL(blob);
      return uri;
    }
  
    const handleError = (err) => {
      console.error(err);
      parent.postMessage({ error: err.toString() }, "*");
    };
  
    window.addEventListener("error", (ev) => {
      ev.preventDefault()
      handleError(ev.error);
    });
  
    const run = (code) => {
      if (!code) return    
      (async () => {
        document.body.innerHTML = document.body.innerHTML
        const uri = createUri(code)
        await import(uri)
      })().then(() => {
       parent.postMessage({ error: '' }, "*");
      }).catch(handleError)
    }
  
    window.addEventListener(
      "message",
      (e) => run(e.data.code),
      false
    );
</script>

`),
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

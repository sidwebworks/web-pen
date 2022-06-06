import { template } from "lodash-es";

const templates = {
  js: template('<script type="module"> ${ code } </script>'),
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
  js = "",
}: {
  html: string;
  css: string;
  js: string;
}) => {
  const output = html
    .replace(JS_REGEX, templates.js({ code: js }))
    .replace(CSS_REGEX, templates.css({ code: css }));

  return output;
};




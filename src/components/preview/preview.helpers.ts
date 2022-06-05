import { template } from "lodash-es";

const templates = {
  js: template('<script type="module"> ${ code } </script>'),
  css: template(`<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <script type="module">

    window.addEventListener(
      "message",
      (e) => {
        
      if (e.data?.js) {
        eval(e.data.js)
      }
      },
      false
    );

    </script>

    <style> <%- code %> </style>
</head>`),
};
const _html = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>

    <style id="_style"></style>
</head>
<body>
    <div id="root"></div>
</body>
<script type="module">
const _log = console.log
const types = ['log', 'debug', 'info', 'warn', 'error', 'table', 'clear', 'time', 'timeEnd', 'count' , 'assert']
function proxy(context, method, message) { 
    return function() {
        window.parent.postMessage({type: "console", method: method.name, data: JSON.stringify(Array.prototype.slice.apply(arguments))}, '*');
    }
  }
  types.forEach(el =>  {
    window.console[el] = proxy(console, console[el], el)
  })
function setHtml(html) {
    document.body.innerHTML = html
}
  function executeJs(javascript) {
    try {
        eval(javascript)
    } catch (err) {
        
    }
}
  function setCss(css) {
    const style = document.getElementById('_style')
    const newStyle = document.createElement('style')
    newStyle.id = '_style'
    newStyle.innerHTML = typeof css === 'undefined' ? '' : css
    style.parentNode.replaceChild(newStyle, style)
  }
  window.addEventListener(
    "error",
    (event) => {
       
    },
    false
);
    window.addEventListener(
        "message",
        (e) => {
            if (typeof e.data.html !== 'undefined'){
                setHtml(e.data.html)
            }
           if (typeof e.data.javascript !== 'undefined'){
             executeJs(e.data.javascript)
           } 
           if (typeof e.data.css !== 'undefined'){
            setCss(e.data.css)
           } 
        },
        false
    );
    </script> 
</html>
`;

const SCRIPT_REGEX = new RegExp(
  /(?<=<!--DO NOT MODIFY-->)(.*)(?=<!--DO NOT MODIFY-->)/gms
);

const HEAD_REGEX = new RegExp(/(?<=<head>)(.*)(?=<\/head>)/gms);

export const createSnippet = ({
  html = "",
  css = "",
  js = "",
}: {
  html: string;
  css: string;
  js: string;
}) => {
  let output = html
    .replace(SCRIPT_REGEX, templates.js({ code: js }))
    .replace(HEAD_REGEX, templates.css({ code: css }));

  return output;
};

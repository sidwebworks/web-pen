import { DirectoryTypes } from "@typings/editor";
import { createDirectory, createFile } from "./fs/filesystem";

export const VANILLA_JS = (name: string) => {
  return createDirectory({
    children: [
      createFile({
        content: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!--STYLES INJECTED BY WEBPEN-->
            <link rel="stylesheet" href="style.css" />
            <!--STYLES INJECTED BY WEBPEN-->
            <title>Document</title>
          </head>
        
          <body>
            <div id="app"></div>
        
            <!--SCRIPT INJECTED BY WEBPEN-->
            <script type="module" src="main.js"></script>
            <!--SCRIPT INJECTED BY WEBPEN-->
          </body>
        </html>        
          `,
        mimeType: "text/html",
        name: "index.html",
        parent: "/",
      }),
      createFile({
        content: `
        :root {
          font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        
          color-scheme: light dark;
          color: rgba(255, 255, 255, 0.87);
          background-color: #242424;
        
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
        }
        
        a {
          font-weight: 500;
          color: #646cff;
          text-decoration: inherit;
        }
        a:hover {
          color: #535bf2;
        }
        
        body {
          margin: 0;
          display: flex;
          place-items: center;
          min-width: 320px;
          min-height: 100vh;
        }
        
        h1 {
          font-size: 3.2em;
          line-height: 1.1;
        }
        
        #app {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        
        .logo {
          height: 6em;
          padding: 1.5em;
          will-change: filter;
        }
        .logo:hover {
          filter: drop-shadow(0 0 2em #646cffaa);
        }
        
        .card {
          padding: 2em;
        }
        
        .read-the-docs {
          color: #888;
        }
        
        button {
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          background-color: #1a1a1a;
          cursor: pointer;
          transition: border-color 0.25s;
        }
        button:hover {
          border-color: #646cff;
        }
        button:focus,
        button:focus-visible {
          outline: 4px auto -webkit-focus-ring-color;
        }
        
        @media (prefers-color-scheme: light) {
          :root {
            color: #213547;
            background-color: #ffffff;
          }
          a:hover {
            color: #747bff;
          }
          button {
            background-color: #f9f9f9;
          }
        }        
          `,
        mimeType: "text/css",
        name: "styles.css",
        parent: "/",
      }),
      createFile({
        content: `
        import { setupCounter } from "./counter.js";

        document.querySelector("#app").innerHTML = \`
          <div>
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"><img class="logo" alt="JavaScript logo" src="/icons/javascript.svg" /></a>
            <h1>Hello JavaScript!</h1>
            <div class="card">
              <button id="counter" type="button"></button>
            </div>
          </div>
        \`;
        
        setupCounter(document.querySelector("#counter"));
          `,
        mimeType: "text/javascript",
        name: "main.js",
        parent: "/",
      }),
      createFile({
        content: `
        export function setupCounter(element) {
          let counter = 0;
          const setCounter = (count) => {
            counter = count;
            element.innerHTML = \`count is \${counter}\`;
          };
          element.addEventListener("click", () => setCounter(++counter));
          setCounter(0);
        }           
          `,
        mimeType: "text/javascript",
        name: "counter.js",
        parent: "/",
      }),
    ],
    isOpen: true,
    name,
    parent: "/",
    type: DirectoryTypes.DEFAULT,
  });
};

export const VANILLA_TS = (name: string) => {
  return createDirectory({
    children: [
      createFile({
        content: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!--STYLES INJECTED BY WEBPEN-->
            <link rel="stylesheet" href="style.css" />
            <!--STYLES INJECTED BY WEBPEN-->
            <title>Document</title>
          </head>
        
          <body>
            <div id="app"></div>
        
            <!--SCRIPT INJECTED BY WEBPEN-->
            <script type="module" src="main.ts"></script>
            <!--SCRIPT INJECTED BY WEBPEN-->
          </body>
        </html>        
          `,
        mimeType: "text/html",
        name: "index.html",
        parent: "/",
      }),
      createFile({
        content: `
        :root {
          font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        
          color-scheme: light dark;
          color: rgba(255, 255, 255, 0.87);
          background-color: #242424;
        
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
        }
        
        a {
          font-weight: 500;
          color: #646cff;
          text-decoration: inherit;
        }
        a:hover {
          color: #535bf2;
        }
        
        body {
          margin: 0;
          display: flex;
          place-items: center;
          min-width: 320px;
          min-height: 100vh;
        }
        
        h1 {
          font-size: 3.2em;
          line-height: 1.1;
        }
        
        #app {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        
        .logo {
          height: 6em;
          padding: 1.5em;
          will-change: filter;
        }
        .logo:hover {
          filter: drop-shadow(0 0 2em #646cffaa);
        }
        
        .card {
          padding: 2em;
        }
        
        .read-the-docs {
          color: #888;
        }
        
        button {
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          background-color: #1a1a1a;
          cursor: pointer;
          transition: border-color 0.25s;
        }
        button:hover {
          border-color: #646cff;
        }
        button:focus,
        button:focus-visible {
          outline: 4px auto -webkit-focus-ring-color;
        }
        
        @media (prefers-color-scheme: light) {
          :root {
            color: #213547;
            background-color: #ffffff;
          }
          a:hover {
            color: #747bff;
          }
          button {
            background-color: #f9f9f9;
          }
        }        
          `,
        mimeType: "text/css",
        name: "styles.css",
        parent: "/",
      }),
      createFile({
        content: `
        import { setupCounter } from "./counter.ts";

        document.querySelector("#app").innerHTML = \`
          <div>
            <a href="https://www.typescriptlang.org" target="_blank"><img class="logo" alt="TypeScript logo" src="/icons/typescript.svg" /></a>
            <h1>Hello TypeScript!</h1>
            <div class="card">
              <button id="counter" type="button"></button>
            </div>
          </div>
        \`;
        
        setupCounter(document.querySelector("#counter"));
          `,
        mimeType: "text/typescript",
        name: "main.ts",
        parent: "/",
      }),
      createFile({
        content: `
        export function setupCounter(element) {
          let counter = 0;
          const setCounter = (count) => {
            counter = count;
            element.innerHTML = \`count is \${counter}\`;
          };
          element.addEventListener("click", () => setCounter(++counter));
          setCounter(0);
        }           
          `,
        mimeType: "text/typescript",
        name: "counter.ts",
        parent: "/",
      }),
    ],
    isOpen: true,
    name,
    parent: "/",
    type: DirectoryTypes.DEFAULT,
  });
};

export const REACT_TS = (name: string) => {
  return createDirectory({
    children: [
      createFile({
        content: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!--STYLES INJECTED BY WEBPEN-->
            <link rel="stylesheet" href="style.css" />
            <!--STYLES INJECTED BY WEBPEN-->
            <title>Document</title>
          </head>
        
          <body>
            <div id="root"></div>
        
            <!--SCRIPT INJECTED BY WEBPEN-->
            <script type="module" src="main.tsx"></script>
            <!--SCRIPT INJECTED BY WEBPEN-->
          </body>
        </html>        
          `,
        mimeType: "text/html",
        name: "index.html",
        parent: "/",
      }),
      createFile({
        content: `
        :root {
          font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        
          color-scheme: light dark;
          color: rgba(255, 255, 255, 0.87);
          background-color: #242424;
        
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
        }
        
        a {
          font-weight: 500;
          color: #646cff;
          text-decoration: inherit;
        }
        a:hover {
          color: #535bf2;
        }
        
        body {
          margin: 0;
          display: flex;
          place-items: center;
          min-width: 320px;
          min-height: 100vh;
        }
        
        h1 {
          font-size: 3.2em;
          line-height: 1.1;
        }
        
        button {
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          background-color: #1a1a1a;
          cursor: pointer;
          transition: border-color 0.25s;
        }
        button:hover {
          border-color: #646cff;
        }
        button:focus,
        button:focus-visible {
          outline: 4px auto -webkit-focus-ring-color;
        }
        
        @media (prefers-color-scheme: light) {
          :root {
            color: #213547;
            background-color: #ffffff;
          }
          a:hover {
            color: #747bff;
          }
          button {
            background-color: #f9f9f9;
          }
        }        

        #root {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        
        .logo {
          height: 6em;
          padding: 1.5em;
          will-change: filter;
        }
        .logo:hover {
          filter: drop-shadow(0 0 2em #646cffaa);
        }
        
        @keyframes logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (prefers-reduced-motion: no-preference) {
          a:nth-of-type(2) .logo {
            animation: logo-spin infinite 20s linear;
          }
        }
        
        .card {
          padding: 2em;
        }
        
        .read-the-docs {
          color: #888;
        }
          `,
        mimeType: "text/css",
        name: "styles.css",
        parent: "/",
      }),
      createFile({
        content: `
        import React from 'react'
        import { useState } from 'react'
        
        function App() {
          const [count, setCount] = useState(0)
        
          return (
            <div className="App">
              <div>
                <a href="https://reactjs.org" target="_blank">
                  <img src="/icons/react_ts.svg" className="logo" alt="React logo" />
                </a>
              </div>
              <h1>Web Pen + React</h1>
              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
                <p>
                  Edit <code>app.tsx</code> and save to test
                </p>
              </div>
              <p className="read-the-docs">
                Click on the React logo  to learn more
              </p>
            </div>
          )
        }
        
        export default App;        
          `,
        mimeType: "text/typescript",
        name: "app.tsx",
        parent: "/",
      }),
      createFile({
        content: `
        import React from 'react'
        import ReactDOM from 'react-dom'
        import App from './app.tsx'
        
        ReactDOM.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
          document.getElementById('root')
        )        
          `,
        mimeType: "text/typescript",
        name: "main.tsx",
        parent: "/",
      }),
    ],
    isOpen: true,
    name,
    parent: "/",
    type: DirectoryTypes.DEFAULT,
  });
};

export const REACT_JS = (name: string) => {
  return createDirectory({
    children: [
      createFile({
        content: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!--STYLES INJECTED BY WEBPEN-->
            <link rel="stylesheet" href="style.css" />
            <!--STYLES INJECTED BY WEBPEN-->
            <title>Document</title>
          </head>
        
          <body>
            <div id="root"></div>
        
            <!--SCRIPT INJECTED BY WEBPEN-->
            <script type="module" src="main.jsx"></script>
            <!--SCRIPT INJECTED BY WEBPEN-->
          </body>
        </html>        
          `,
        mimeType: "text/html",
        name: "index.html",
        parent: "/",
      }),
      createFile({
        content: `
        :root {
          font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        
          color-scheme: light dark;
          color: rgba(255, 255, 255, 0.87);
          background-color: #242424;
        
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
        }
        
        a {
          font-weight: 500;
          color: #646cff;
          text-decoration: inherit;
        }
        a:hover {
          color: #535bf2;
        }
        
        body {
          margin: 0;
          display: flex;
          place-items: center;
          min-width: 320px;
          min-height: 100vh;
        }
        
        h1 {
          font-size: 3.2em;
          line-height: 1.1;
        }
        
        button {
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          background-color: #1a1a1a;
          cursor: pointer;
          transition: border-color 0.25s;
        }
        button:hover {
          border-color: #646cff;
        }
        button:focus,
        button:focus-visible {
          outline: 4px auto -webkit-focus-ring-color;
        }
        
        @media (prefers-color-scheme: light) {
          :root {
            color: #213547;
            background-color: #ffffff;
          }
          a:hover {
            color: #747bff;
          }
          button {
            background-color: #f9f9f9;
          }
        }        

        #root {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        
        .logo {
          height: 6em;
          padding: 1.5em;
          will-change: filter;
        }
        .logo:hover {
          filter: drop-shadow(0 0 2em #646cffaa);
        }
        
        @keyframes logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (prefers-reduced-motion: no-preference) {
          a:nth-of-type(2) .logo {
            animation: logo-spin infinite 20s linear;
          }
        }
        
        .card {
          padding: 2em;
        }
        
        .read-the-docs {
          color: #888;
        }
          `,
        mimeType: "text/css",
        name: "styles.css",
        parent: "/",
      }),
      createFile({
        content: `
        import React from 'react'
        import { useState } from 'react'
        
        function App() {
          const [count, setCount] = useState(0)
        
          return (
            <div className="App">
              <div>
                <a href="https://reactjs.org" target="_blank">
                  <img src="/icons/react.svg" className="logo" alt="React logo" />
                </a>
              </div>
              <h1>Web Pen + React</h1>
              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
                <p>
                  Edit <code>app.jsx</code> and save to test
                </p>
              </div>
              <p className="read-the-docs">
                Click on the React logo  to learn more
              </p>
            </div>
          )
        }
        
        export default App;        
          `,
        mimeType: "text/javascript",
        name: "app.jsx",
        parent: "/",
      }),
      createFile({
        content: `
        import React from 'react'
        import ReactDOM from 'react-dom'
        import App from './app.jsx'
        
        ReactDOM.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
          document.getElementById('root')
        )        
          `,
        mimeType: "text/javascript",
        name: "main.jsx",
        parent: "/",
      }),
    ],
    isOpen: true,
    name,
    parent: "/",
    type: DirectoryTypes.DEFAULT,
  });
};

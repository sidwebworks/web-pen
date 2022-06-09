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
           <h1> Hello world </h1>
          
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
         * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            height: 100vh;
            background-color: teal;
          }
          
          `,
        mimeType: "text/css",
        name: "styles.css",
        parent: "/",
      }),
      createFile({
        content: `
        import { secret, greet } from "./app.js";

        const elem = document.querySelector("h1");
        
        elem.addEventListener("click", () => alert(greet(secret)));  
          `,
        mimeType: "text/javascript",
        name: "main.js",
        parent: "/",
      }),
      createFile({
        content: `
        const secret = "Sidharth";

        export const greet = (name) => {
          return "Hello there " + name;
        };
        
        export { secret };      
          `,
        mimeType: "text/javascript",
        name: "app.js",
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
             <h1> Hello world </h1>
            
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
           * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              height: 100vh;
              background-color: teal;
            }
            
            `,
        mimeType: "text/css",
        name: "styles.css",
        parent: "/",
      }),
      createFile({
        content: `
          import { secret, greet } from "./app.ts";
  
          const elem = document.querySelector("h1");
          
          elem.addEventListener("click", () => alert(greet(secret)));  
            `,
        mimeType: "text/typescript",
        name: "main.ts",
        parent: "/",
      }),
      createFile({
        content: `
          const secret = "Sidharth";
  
          export const greet = (name) => {
            return "Hello there " + name;
          };
          
          export { secret };      
            `,
        mimeType: "text/typescript",
        name: "app.ts",
        parent: "/",
      }),
    ],
    isOpen: true,
    name,
    parent: "/",
    type: DirectoryTypes.DEFAULT,
  });
};

export const css = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

body {
  height: 100vh;
  background-color: black;
}

.app img {
  margin: auto;
  animation: spin 10s linear infinite forwards;
  height: 20em;
}

`;

export const html = `
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
  <main class="app center">
    <img
        src="https://download.logo.wine/logo/React_(web_framework)/React_(web_framework)-Logo.wine.png"
      />
  </main>

  <!--SCRIPT INJECTED BY WEBPEN-->
  <script type="module" src="main.js"></script>
  <!--SCRIPT INJECTED BY WEBPEN-->
</body>

</html>

`;

export const js = {
  app: `
  const secret = "Sidharth";

  export const greet = (name) => {
    return "Hello there " + name;
  };
  
  export { secret };

  `,
  main: `
  import { secret, greet } from "./app.js";

  const elem = document.querySelector(".app > img");
  
  elem.addEventListener("click", () => alert(greet(secret)));  
  `,
};

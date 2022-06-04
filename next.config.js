const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const withTM = require("next-transpile-modules")(["monaco-editor"]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin());

    return config;
  },
  compress: true,
  reactStrictMode: true,
});

module.exports = nextConfig;

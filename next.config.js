/** @type {import('next').NextConfig} */

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.plugins.push(
			new MonacoWebpackPlugin({
				languages: ["css", "typescript", "javascript", "html"],
				filename: "static/chunks/[name].worker.js",
			})
		);

		return config;
	},
};

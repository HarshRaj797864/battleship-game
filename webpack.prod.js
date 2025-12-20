const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "main.[contenthash].js", // Hash for cache busting
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: false, // No source maps in production
});

const path = require("path");
const { merge } = require("webpack-merge"); // Import the merge function
const common = require("./webpack.common.js"); // Import your common config

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map", // Best for debugging
  devServer: {
    watchFiles: ["./src/template.html"],
    static: "./dist",
    hot: true, // Enable hot module replacement
    open: true, // Automatically open browser
    client: {
      logging: 'warn', // Only show errors and warnings in the browser console
      overlay: true,   // Keep the red error screen if your code actually breaks
    },
  },
});

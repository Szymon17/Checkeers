const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: {
    main: "./src/app.js",
  },

  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "../dev"),
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,

        type: "asset/resource",
      },

      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [new HtmlWebpackPlugin({ template: "./src/Templates/index.html" })],

  devServer: {
    watchFiles: ["./src/Templates/*"],
    port: 3000,
    open: true,
    hot: true,
  },
};

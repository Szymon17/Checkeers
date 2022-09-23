const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
   mode: "production",

   entry: {
      main: "./src/app.js",
   },

   output: {
      filename: "[name]-[contenthash:5]-bundle.js",
      path: path.resolve(__dirname, "../dist"),
   },

   module: {
      rules: [
         {
            test: /\.(png|jpe?g|gif)$/i,
            type: "asset/resource",
            use: [
               {
                  loader: "image-webpack-loader",
                  options: {
                     mozjpeg: {
                        quality: 70,
                     },
                  },
               },
            ],
         },
         {
            test: /.sass$|.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
         },
         {
            test: /.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
         },
      ],
   },

   plugins: [
      new HtmlWebpackPlugin({ template: "./src/Templates/index.html" }),
      new MiniCssExtractPlugin({ filename: "[name]-[contenthash:5].css" }),
      new CleanWebpackPlugin(),
   ],
};

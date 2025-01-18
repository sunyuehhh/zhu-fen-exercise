const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 配置loader的几种方式
// 1.配置绝对路径  loader: path.resolve(__dirname, "./loaders/babel-loader.js"),
// 2.配置resolveLoader
// 3.如果说loader很多，用alias一个一个配置很麻烦，resolveLoader.modules指定一个目标，找loader的时候会先去目录下找
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    // alias: {
    //   "babel-loader": path.resolve(__dirname, "./loaders/babel-loader.js"),
    // },
    modules: [path.resolve("loaders"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader1",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          {
            loader: "babel-loader2",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};

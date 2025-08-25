const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: false,
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
           {
            test:/\.js$/,
            exclude:/node_modules/,
            use:{
              loader:path.resolve(__dirname,'loaders/babel-loader.js'),
              options:{
                presets:['@babel/preset-env']
              }
            }
           }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
};
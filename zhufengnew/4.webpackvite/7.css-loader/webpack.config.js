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
            test:/\.css$/,
            use:[
              "to-string-loader",
              // path.resolve(__dirname,'./loaders/to-string-loader.js'),
              {
                // loader:path.resolve(__dirname,'./loaders/css-loader.js'),
                loader:'css-loader',
                options:{
                  url:true,//是否解析url()
                  import:true,//是否解析@import语法
                  esModule:false//不包装ES MODULE 默认是common.js导出
                }
              }
            ],
            include:path.resolve('src')
           },
           {
            test:/\.(jpg|png|gif)/,
            use:["file-loader"]
           }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
};
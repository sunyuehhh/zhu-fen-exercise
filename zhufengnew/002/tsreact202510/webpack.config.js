const webpack=require('webpack')
const HtmlWebpackPlugin=require('html-webpack-plugin')
const path=require('path')
module.exports={
  mode:'development',
  entry:'./src/index.tsx',
  devtool:"source-map",
  output:{
    path:path.join(__dirname,'dist'),
    filename:'bundle.js'
  },
  devServer:{
    hot:true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback:{//browser路由的话 如果路径不能正常影响则会重定向到index.html里去
      index:'./index.html'
    },
  },
  resolve:{
      extensions:[".ts",".tsx",".js",".json"],
      alias:{
        "@":path.resolve("src")
      }
    },
  module:{
    rules:[
      {
        test:/.tsx?$/,
        loader:"ts-loader"
      },
      {
        enforce:"pre",//提前执行 可以让我们调整ts源代码
        test:/.tsx?$/,
        loader:"source-map-loader"
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]

}
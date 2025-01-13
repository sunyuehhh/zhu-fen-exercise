const path=require('path')
const HtmlWebpackPlugin=require('html-webpack-plugin')
const webpack = require('webpack');
module.exports={
  mode:process.env.NODE_ENV,
  entry:'./src/index.js',
  devtool:false,
  output:{
    path:path.resolve(__dirname,'dist'),
    // 写入文件名
    filename:'main.js'
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        // 最右侧的loader读的是源文件内容 最左侧的loader一定会返回一个js模块
        use:['style-loader','css-loader']
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({template:path.resolve('./src/index.html')}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // 注意这里需要使用 JSON.stringify 来确保常量是字符串
    }),
  ]
}
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
    filename:'main.js',
    assetModuleFilename:'assets/[hash][ext][query]',
    clean:true,

  },
  devServer:{
    port:8000,
    open:true,
    static:path.resolve(__dirname,'public')
  },
  module:{
    rules:[
      {
        test:/\.jsx?$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:["@babel/preset-env","@babel/preset-react"],
            plugins:[
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              [
                "@babel/plugin-proposal-private-property-in-object",
                { loose: true },
              ],
              [
                "@babel/plugin-proposal-private-methods",
                { loose: true },
              ],
              [
                "@babel/plugin-proposal-class-properties",
                { loose: true },
              ]
            ]
          }
        }
      },
      {
        test:/\.css$/,
        // 最右侧的loader读的是源文件内容 最左侧的loader一定会返回一个js模块
        use:['style-loader','css-loader','postcss-loader']
      },
      {
        test:/\.scss$/,
        // 最右侧的loader读的是源文件内容 最左侧的loader一定会返回一个js模块
        use:['style-loader','css-loader','postcss-loader','sass-loader']
      },
      {
        test:/\.png$/,//会把图片自动拷贝到输出目录中，并返回路径或者名称
        // use:["file-loader"]
        type:'asset/resource'
      },
      {
        test:/\.ico$/,//会把ico变成base64字符串并返回
        // use:["url-loader"]
        type:'asset/inline'
      },
      {
        test:/\.txt$/,//会把txt内容直接返回
        type:'asset/source',
        generator:{
          filename:'txt/[hash][ext]',
        }
      },
      {
        test:/\.jpg$/,
        type:'asset',//表示可以根据实际情况进行自动选择是resource还是inline
        parser:{
          dataUrlCondition:{
            maxSize:4*1024//如果文件大小小于4k就走inline,如果大于4k就走resource
          }
        }
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
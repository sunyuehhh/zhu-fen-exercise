const path=require('path')
const HtmlWebpackPlugin=require('html-webpack-plugin')

module.exports={
  mode:'development',
  devtool:false,
  entry:'./src/index.js',
  cache:{
    type:'filesystem',//memory filesystem
    cacheDirectory:path.resolve(__dirname,'node_modules/.cache/webpack')
  },
  devServer:{
    port:8080
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:[{
          loader:'babel-loader',
          options:{
            presets:[
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }]
      },
      {
        test:/\.png$/,
        type:'asset/resource',//对标file-loader
      },
      {
        type:/\.ico$/,
        type:'asset/inline'//对标url-loader 模块的大小 <limit  base64字符串

      },
      {
        type:/\.txt$/,
        type:'asset/source' //对标raw-loader
      },
      {
        test:/\.jpg$/,
        type:'asset',//对标raw-loader
        parser:{
          dataUrlCondition:{
            maxSize:4*1024
          }
        }
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./public/index.html'
    })
  ]
}
// webpack 是node写出来的  node方法
let path=require('path')
const HtmlWebpackPlugin=require('html-webpack-plugin')
let MiniCssExtractPlugin=require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports={
  devServer:{//开发服务器的配置
    port:3000,
    static:{
      directory:path.join(__dirname,'./dist')
    },
  },
  mode:'development',//模式  默认两种  production development
  entry:"./src/index.js",//入口
  output:{
    filename:'bundle.[hash:8].js',//打包后的文件名
    path:path.resolve(__dirname,'dist')//路径必须是个绝对路径
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins:[//数组  放着所有的webpack插件
    new HtmlWebpackPlugin({
      template:'./src/index.html',
      filename:'index.html',
      // minify:{
      //   removeAttributeQuotes:true,
      //   collapseWhitespace:true
      // },
      hash:true
    }),
    new MiniCssExtractPlugin({
      filename:'main.css'
    })
  ],
  module:{//模块
    rules:[
      {
        test:/\.html$/,
        use:'html-loader'
      },
      {
        test:/\.(png|jpg|gif)$/,
        use:'file-loader'
      },
      {
        test: require.resolve('jquery'), // 匹配 jQuery 文件
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'], // 暴露 $ 和 jQuery 到全局
        },
      },
      //规则  css-loader 处理@import 这种语法的
      // style-loader 她是把css 插入到head的标签中
      // loader的特点  希望单一
      // loader的用法 字符串只用一个loader
      // 多个loader需要 []
      // loader的顺序  默认是从右向左执行
      {
        test:/\.js$/,
        use:{
          loader:'babel-loader',
          options:{//用babel-loader 需要把es6-es5
            presets:[
              '@babel/preset-env'
            ]

          }
        },
        include:path.resolve(__dirname,'src'),
        exclude:/node_modules/
      },
      {
        // 可以处理less文件
        test:/\.css$/,
        use:[
        // {
        //   loader:'style-loader',
        //   options:{
        //     insertAt:'top'
        //   }
        // }
        MiniCssExtractPlugin.loader
        ,'css-loader','postcss-loader']
      },
      {
        // 可以处理less文件
        test:/\.less$/,
        use:[
        //   {
        //   loader:'style-loader',
        //   options:{
        //     insertAt:'top'
        //   }
        // }
         MiniCssExtractPlugin.loader
        ,'css-loader','postcss-loader','less-loader']//把less->css
      }

    ]

  }
}
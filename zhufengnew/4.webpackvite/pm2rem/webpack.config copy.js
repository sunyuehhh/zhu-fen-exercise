const path=require('path')
const HtmlWebpackPlugin=require('html-webpack-plugin')
module.exports={
  mode:'development',
  devtool:false,
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'main.js'
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use:[
          'style-loader',
          'css-loader',
          {
            loader:'px2rem-loader',
            options:{
              remUnit:75,
              remPrecision:8
            }
          }
        ]
      }

    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    })
  ]
}
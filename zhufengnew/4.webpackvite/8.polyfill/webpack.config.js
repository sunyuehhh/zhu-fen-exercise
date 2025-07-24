const path=require('path')
const HtmlWebpackPlugin=require('html-webpack-plugin')

module.exports={
  mode:'development',
  devtool:false,
  entry:"./src/index.js",
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'main.js'
  },
  module:{
    rules:[
      {
        test:/\.js/,
        exclude:/node_modules/,
        use:{
          loader:'babel-loader',
          options:{
            targets:{
              "browsers":["last 2 versions"]
            },
            presets:[
              ["@babel/preset-env",{
                useBuiltIns:false,
              }]
            ],
            plugins:[
              ["@babel/plugin-transform-runtime",{
                corejs:{
                  version:3
                }
              }]
            ]

          }
        }
      }

    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    })
  ]
}
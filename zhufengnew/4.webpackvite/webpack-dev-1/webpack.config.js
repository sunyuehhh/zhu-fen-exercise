const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // 使用自定义loader（确保路径正确）
        use: [{
          loader: path.resolve(__dirname, 'loaders/loader1.js'),
          options:{
            text:'珠峰',
            filename:path.resolve(__dirname,'src/banner.js')
          }
        }],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}
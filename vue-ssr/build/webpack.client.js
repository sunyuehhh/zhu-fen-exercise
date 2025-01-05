const { merge } = require('webpack-merge'); // 确保正确引入 merge 函数
const base=require('./webpack.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ClientRenderPlugin=require('vue-server-renderer/client-plugin')
const path=require('path')
const resolve=(dir)=>{
  return path.resolve(__dirname,dir)
}
module.exports=merge(base,{
  entry:{
    client:resolve('../src/client-entry.js'),
  },
  plugins:[
    new ClientRenderPlugin(),
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:resolve('../public/index.html')
    })
  ]
})
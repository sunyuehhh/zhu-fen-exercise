const { merge } = require('webpack-merge'); // 确保正确引入 merge 函数
const base=require('./webpack.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ServerRenderPlugin=require('vue-server-renderer/server-plugin')
const path=require('path')
const resolve=(dir)=>{
  return path.resolve(__dirname,dir)
}
module.exports=merge(base,{
  entry:{
    server:resolve('../src/server-entry.js'),
  },
  target:'node',//要给node来使用
  output:{
    libraryTarget:'commonjs2'//把最终这个文件的到处结果  放到module.exports上
  },
  plugins:[
    new ServerRenderPlugin(),
    new HtmlWebpackPlugin({
      filename:'index.ssr.html',
      template:resolve('../public/index.ssr.html'),
      excludeChunks:['server'],//排除某个模块
    })
  ]
})
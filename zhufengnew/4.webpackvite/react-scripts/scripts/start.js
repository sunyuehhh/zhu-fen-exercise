process.env.NODE_ENV='development'
const fs=require('fs-extra')

// 2.获取webpack的配置文件
const configFactory=require('../config/webpack.config')
const createDevServerConfig=require('../config/webpackDevServer.config')

const paths=require('../config/paths')
const webpack=require('webpack')
const chalk=require('chalk')

const config=configFactory('development')
const WebpackDevServer=require('webpack-dev-server')


let compiler=webpack(config)
/**
 * 1.内部会启动compiler的编译
 * 2.会启动一个HTTP服务器并返回编译后的结果
 */
const devServer=new WebpackDevServer(compiler,createDevServerConfig)
devServer.listen(3000,()=>{
   console.log(chalk.cyan('Starting the development server'))
})

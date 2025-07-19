#! /usr/bin/env node
// 可以运行得脚本



// 需要通过http启动一个模块   内部是基于koa得


// 创建一个koa服务器
const createServer=require('../index')


createServer().listen(4000,()=>{
  console.log('server start 4000 port')
})
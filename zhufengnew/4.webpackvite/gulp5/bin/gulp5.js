#!/usr/bin/env node
const path=require('path')
// gulp的实例
const gulpInst=require('../lib')
const registerExports=require('./register-exports')
// 获取要执行的任务的名称
const logEvents=require('./logEvents')
logEvents(gulpInst)
const taskName=process.argv[2];
// 获取要执行的任务名
const toRun=taskName||'default'
// 获取gulpfile配置文件
const configPath=path.join(process.cwd(),'gulpfile.js')
console.log(`using gulpfile ${configPath}`)
// 获取他的导出对象
const exported=require(configPath)
// 注册导出的任务到gulp的实例身上
registerExports(gulpInst,exported)
gulpInst.parallel(toRun)(()=>{
  console.log('well done')
})
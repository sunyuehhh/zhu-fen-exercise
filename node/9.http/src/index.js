// 希望根据路径的不同  返回对应的资源
// const http=require('http')
// const fsPromise=require('fs/promises')
// const {createReadStream}=require('fs')
// const path=require('path')
// const zlib=require('zlib')
// const url=require('url')
// const chalk=require('chalk')//高版本    require和import 语法不兼容了...

import http from 'http'
import path,{dirname} from 'path'
import url,{fileURLToPath} from 'url'
import fsPromise from 'fs/promises'
import { createReadStream ,readFileSync} from 'fs'
import {getNetWorkInterfaces} from './utils.js'
import mime from 'mime'
import ejs from 'ejs'


// 以上是内置的模块
import chalk from 'chalk'

// import { createRequire } from 'module'
// const require=createRequire(import.meta.url)
// console.log(require('./1.cjs'))

// function getNetWorkInterfaces(){
//  return Object.values(os.networkInterfaces()).flat().filter(item=>item.family==='IPv4').map(item=>item.address)
// }


// const __filename=decodeURIComponent(new URL(import.meta.url).pathname);
// const __dirname=path.dirname(__filename)
const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = decodeURIComponent(new URL(import.meta.url).pathname);

class Server{
  constructor(options={}){
    this.port=options.port
    this.directory=options.directory
    // console.log(__filename,__dirname,'__dirname')
    this.template=readFileSync(path.join(__dirname,'/tmpl.html'),'utf8')
    
  }

  sendFile(assetsUrl,req,res){
    const fileType=mime.getType(assetsUrl)||'text/plain'
    res.setHeader('Content-Type',fileType+';charset=utf-8')

    createReadStream(assetsUrl).pipe(res);//处理大文件，可以指定读取文件内容

  }

  sendError(assetsUrl,req,res){
    console.log(`cannot found ${assetsUrl}`)
    res.statusCode=404
    res.end('Not Found')

  }

  async processDir(assetsUrl,pathname,req,res,statObj){
    try {
      const newAssetsUrl= path.join(assetsUrl,'index.html')
      await fsPromise.stat(newAssetsUrl)
      this.sendFile(newAssetsUrl,req,res)
    } catch (error) {
      // 展示这个文件下面的所有文件
      const dirs=await fsPromise.readdir(assetsUrl);//将访问的路径的子目录列举出来
      const tempStr=ejs.render(this.template,{
        dirs:dirs.map(dir=>({
          url:path.join(pathname,dir),
          dir,
          // stat:(await fsPromise.stat(path.join(assetsUrl,dir))),
        }))
      })
      res.setHeader('Content-Type','text/html;charset=utf-8')
    res.end(tempStr)
    }


  }
  handleRequest=async (req,res)=>{
    // console.log(this)  //保证this指向myServer的实例
    const {pathname,query}=url.parse(req.url,true)
    console.log(pathname,query)
    const accessUrl=path.join(this.directory,decodeURIComponent(pathname))
    try {
      // 获取文件的状态信息
      const statObj=await fsPromise.stat(accessUrl)
      // 获取文件是否存在
      if(statObj.isFile()){
        this.sendFile(accessUrl,req,res)


      }else{
        // 文件夹的情况
        // 需要看文件夹下是否有index.html  如果有则返回  没有则展示当前目录下所有的文件列表
       return  this.processDir(accessUrl,pathname,req,res,statObj)

      }

      
    } catch (error) {
      this.sendError(accessUrl,req,res)
      
    }



  }
  start(){
    const server=http.createServer(this.handleRequest)


    server.listen(this.port,()=>{
      console.log(`${chalk.yellow('Starting up http-server,serving')} ${chalk.green(path.relative(__dirname,this.directory))}`)
      console.log(`Available on:`)
      getNetWorkInterfaces().map(address=>console.log(`${chalk.green(`http://${address}:${this.port}`)}`))
      

    })

  }

}

// // 静态服务为了哪个目录提供的
// new Server({
//   port:3000,
//   directory:process.cwd(),//再哪里启动服务就以这个目录为准
// }).start()


export default Server
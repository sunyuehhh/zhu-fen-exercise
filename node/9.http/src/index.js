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
import url,{fileURLToPath,pathToFileURL} from 'url'
import fsPromise from 'fs/promises'
import { createReadStream ,readFileSync} from 'fs'
import querystring from 'querystring'
import {getNetWorkInterfaces} from './utils.js'
import mime from 'mime'
import ejs from 'ejs'
import crypto, { createHash } from 'crypto'
import zlib from 'zlib'

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

  cache(){
    // 强缓存+对比缓存
    // 客户端访问我第一次来得时候  我希望30s内不要再访问我了，并且给你一个缓存得etag
    // 30s  访问都用本地
    // 超过30s后  会向服务器发送请求 携带if-no-match  服务器和现在得etag做对比看看是否返回新文件
    // 30s  访问都用本地
    // ...


    res.setHeader('Cache-Control','max-age=30')
    const etag=statObj.ctime.getTime()+'-'+statObj.size();//相对靠谱  如果在一秒之内变化了  但是size没变就会有问题  但这种情况很少
    res.setHeader('Etag',etag)
    if(req.headers['if-none-match']===etag){//找本地缓存，文件灭有改变
      res.statusCode=304;
      return res.end()
    }
  }

  compress(req,res){
    const encoding=req.headers['accept-encoding']
    if(encoding){
      if(encoding.includes('gzip')){
        res.setHeader('Content-Encoding','gzip')
        return zlib.createGzip()
      }else if(encoding.includes('deflate')){
        res.setHeader('Content-Encoding','deflate')
        return zlib.createDeflate()
      }else if(encoding.includes('br')){
        res.setHeader('Content-Encoding','br')
        return zlib.createBrotliDecompress()

      }

    }

  }

  sendFile(assetsUrl,req,res,statObj){
    // // 默认情况下  对访问过的资源 浏览器都会对这些资源进行缓存操作 ，我们可以基于缓存来实现缓存(对比缓存，强制缓存)

    // // 协商   默认首页是没有缓存的  会在发送请求的时候  增加Cache-Control:max-age=0  max-age=0意味着一定要向服务器发送请求
    // // (取消强制缓存)
    // console.log(req.url,'req.url')
    // // 强制缓存  不会向服务端发送请求  所以用的是本地的   如果服务端文件变化了  不会生效  hash值来保证使用最新的内容
    // res.setHeader('Cache-Control','max-age=20');//20s不要再向服务端发送请求了  强制缓存一般对变化不大的文件进行缓存

    // // expires  本地时间和服务器时间可能不一致  导致缓存失效
    // // res.setHeader('Expires',new Date((Date.now()+10*10000)).toGMTString())



    // 协商缓存   特点是询问服务器需不需要使用缓存
    
    // // 第一次你来我给你一个文件的最后修改时间 3:00 下次你来请求  带上这个时间 我来比较以下时间是否发生变化
    // console.log(statObj?.ctime,'statObj.ctime')
    // // res.setHeader('Last-Modified',statObj.ctime.toGMTString())
    // // 最后修改时间的方案 问题?  秒为单位  (时间是绝对时间)  如果1s内改了多次 会有可能文件变化了但是用的还是以前的
    // const ctime=statObj.ctime.toGMTString()
    // res.setHeader('Last-Modified',ctime)
    // if(req.headers['if-modified-since']==ctime){//第二次来我要比较一下时间是否一致
    //   res.statusCode=304
    //   return res.end()
    // }

    // 目的是尽可能缓存，但是不能出bug   直接比较前后的内容


    // const md5=crypto.createHash('md5')
    // const etag=md5.update(fsPromise.readFileSync(assetsUrl,'utf8')).digest('base64')//第二次我要比较一下时间是否一致
    // if(req.headers['if-none-match']===etag){//找本地缓存，文件灭有改变
    //   res.statusCode=304;
    //   return res.end()
    // }
    // res.setHeader('Etag',etag)//最靠谱的  问题是在于得读取  读大文件


    const fileType=mime.getType(assetsUrl)||'text/plain'
    let stream;
    if(stream=this.compress(req,res)){
    createReadStream(assetsUrl).pipe(stream).pipe(res)//处理大文件，可以指定读取文件内容
    }else{
    createReadStream(assetsUrl).pipe(res);//处理大文件，可以指定读取文件内容
    }
    res.setHeader('Content-Type',fileType+';charset=utf-8')

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
      this.sendFile(newAssetsUrl,req,res,statObj)
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

 async  processData(pathname,req,res){
  console.log('processData')
    // const mockFilePath=path.join(this.directory,'/mock/index.js')
    const mockFilePath = pathToFileURL(path.join(this.directory, 'mock/index.js')).href;
    try {
      let plugin=await import(mockFilePath)
     return plugin.default(pathname,req,res)

    } catch (error) {
      return false  //没有匹配到静态服务
    }



  }

  cors(req,res){
    // 跨域
    // cookie  跨域需要提供确切的origin，不能写成*
    // res.setHeader('Access-Control-Allow-Origin','*')
    if(req.headers.origin){//此时就是有跨域
      // 谁访问我  我就允许谁来访问
      res.setHeader('Access-Control-Allow-Origin',req.headers.origin)
      res.setHeader('Access-Control-Allow-Headers','Content-Type,token,authorization')
      res.setHeader('Access-Control-Max-Age',20)
      // 跨域只默认支持get post options   不支持delete put
      res.setHeader('Access-Control-Allow-Methods','DELETE,PUT')

      if(req.method=='OPTIONS'){
        // 预检请求
        res.end();//可以访问  就结束了   就会发送真正的请求

        return true

      }

    }
  }

  handleRequest=async (req,res)=>{
    // console.log(this)  //保证this指向myServer的实例
    const {pathname,query}=url.parse(req.url,true)
    console.log(pathname,query)
    const accessUrl=path.join(this.directory,decodeURIComponent(pathname))

    const isOption=this.cors(req,res)
    if(isOption){
      return
    }





    req.query=query;//将解析后的查询参数绑定再req上
    req.body=await new Promise((resolve,reject)=>{
      const arr=[]
      req.on('data',function(chunk){
        arr.push(chunk)
      })

      req.on('end',function(){
        const payload=Buffer.concat(arr).toString()//当前用户传递的请求体参数

        // payload的类型?  字符串,对象，查询字符串
        if(req.headers['content-type']==='application/x-www-form-urlencoded'){
          // 根据表单格式处理数据  a=1&b=2 /([^=&]+)=([^=&]+)/   qs

          
          // res.setHeader('Content-Type','application/json')
          // 将解析后的对象赋给req.body属性
          resolve(querystring.parse(payload))

          
        }else if(req.headers['content-type']==='application/json'){
          resolve(JSON.parse(payload))

        }else if(req.headers['content-type']==='text/plain'){
          resolve(payload)

        }

        resolve({default:'sunyue'})

      })

    })


   let flag= await this.processData(pathname,req,res)
   if(flag){
    return
   }



    try {
      // 获取文件的状态信息
      const statObj=await fsPromise.stat(accessUrl)
      // 获取文件是否存在
      if(statObj.isFile()){
        this.sendFile(accessUrl,req,res,statObj)


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
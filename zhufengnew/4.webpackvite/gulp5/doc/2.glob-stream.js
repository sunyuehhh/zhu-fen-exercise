const {Readable} =require('stream')
const util=require('util')
const {Glob}=require('glob')
const globParent=require('glob-parent')
const toAbsoluteGlob=require('to-absolute-glob')

function GlobStream(glob,opt={}){
  // 当前的工作目录  如果没有给就等于当前的目录
  opt.cwd=opt.cwd||process.cwd();
  Readable.call(this,{
    objectMode:true
  })//objectMode流里放的可以不是Buffer 而是对象
  let absoluteGlob=toAbsoluteGlob(glob)
  console.log(absoluteGlob,'absolute')
  let basePath=globParent(absoluteGlob)
  console.log('basePath',basePath)

  // globber也是一个可读流
  let globber=new Glob(absoluteGlob,opt)
  this._globber=globber
  globber.on('match',(filePath)=>{
    let obj={
      cwd:opt.cwd,//当前工作目录
      base:basePath,//基本路径  父路径
      path:filePath//文件路径
    }
    this.push(obj)

  })

  globber.on('end',()=>{
    this.push(null)
  })

  
}

GlobStream.prototype._read=function(){
  // 开始读取数据  on('data')内部其实也是调用resume方法 打开开头  让数据开始流动
  this._globber.resume()
}

util.inherits(GlobStream,Readable)


module.exports=GlobStream
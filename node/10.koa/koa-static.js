const fs=require('fs')
const path=require('path')
const {access}=require('fs/promises')
const mime=require('mime')

module.exports=function(root){
  // 讲台文件中间件优先级其实是比较低的
  return async function(ctx,next) {
    // 先向后执行
    await next()
    // 判断后面的执行有没有赋给响应体
    if(!!ctx.body) return
    // 先找到文件的路径  绝对路径  用静态文件根目录加上文件路径  得到文件再硬盘上的绝对路径
    const filename=path.join(root,ctx.path)
    // 判断文件是否存在
    if(await exists(filename)){
      // 获取文件的后缀  也就是扩展名  也就是文件的类型
      // 再通过文件类型动态获取MIME类型，也就是内容类型
      ctx.set('Content-Type',mime.getType(path.extname(ctx.path)))
      ctx.body=fs.createReadStream(filename)
      // ctx.body=await fs.readFile(filename)  等价  为什么用流  解决内存
    }
  }
}


async function exists(path) {
  try {
    // access用来判断一个路径上的文件是否可以访问
    await access(path)
    return true
  } catch (error) {
    return false
    
  }
  
}
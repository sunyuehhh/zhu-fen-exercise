var File=require('vinyl')
const through=require('through2')
const fs=require('fs')
function wrapVinyl(){
  // 这其实是一个转换函数  读取文件内容  放在contents上
  function readFile(file,encoding,next){
    fs.readFile(file.path,'binary',(err,data)=>{
      file.contents=Buffer.from(data)
      next(null,file)

    })
  }
  return through.obj(readFile)
}

module.exports=wrapVinyl
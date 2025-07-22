var File=require('vinyl')
const through=require('through2')
const fs=require('fs-extra')
var path=require('path')
function wrapVinyl(outFolder){
  // 这其实是一个转换函数  读取文件内容  放在contents上
  function writeFile(file,encoding,next){
    let outputPath=path.resolve(file.cwd,outFolder)
    console.log(outputPath,'outputPath')
    let writePath=path.resolve(outputPath,file.relative)
    console.log('file.relative',file.relative)
    console.log('writePath',writePath)
    file.path=writePath
    fs.ensureDir(path.dirname(writePath),(err)=>{
      fs.writeFile(file.path,file.contents,encoding,next)

    })
  }
  return through.obj(writeFile)
}

module.exports=wrapVinyl
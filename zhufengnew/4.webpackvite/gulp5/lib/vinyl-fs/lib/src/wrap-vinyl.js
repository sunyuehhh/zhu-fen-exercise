var File=require('vinyl')
const through=require('through2')
function wrapVinyl(){
  // 这其实是一个转换函数
  function wrapFile(globFile,encoding,next){
    next(null,new File(globFile))
  }
  return through.obj(wrapFile)
}

module.exports=wrapVinyl
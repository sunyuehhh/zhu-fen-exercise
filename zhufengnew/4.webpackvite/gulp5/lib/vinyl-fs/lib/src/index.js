var GlobStream=require('./glob-stream')
var wrapVinyl=require('./wrap-vinyl')
var readContents=require('./read-contents')
function src(glob,opt){
  let gs=new GlobStream(glob,opt)
  return gs//获取一个globFile的可读流
    .pipe(wrapVinyl())//把每个globFile包装成一个vinyl File对象
    .pipe(readContents())//读取每个file对象的文件内容 并存在file.contents上

}

module.exports=src
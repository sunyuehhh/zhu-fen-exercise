class Stats{
  constructor(compilation){
    console.log(compilation,'compilation')
    this.entries=compilation?.entries;//入口
    this.module=compilation?.modules;//模块
    this.chunks=compilation?.chunks;//代码块
    this.files=compilation.files;//文件名数组

  }

  toJson(){
    return this
  }
}

module.exports=Stats
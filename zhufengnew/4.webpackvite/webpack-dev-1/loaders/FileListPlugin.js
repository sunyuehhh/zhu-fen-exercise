class FileListPlugin{
  constructor({filename}){
    this.filename=filename

  }
  apply(compiler){
    // 文件已经准备好了 要进行发射
    // emit
    compiler.hooks.emit.tap('FileListPlugin',(complication)=>{
      console.log(complication.assets)
      let assets=complication.assets
      let content=`## 文件名    资源大小`
      // [[bundle.js,{}],[index.html,{}]]
      Object.entries(assets).forEach(([filename,statObj])=>{
        content+=`- ${filename} ${statObj.size()}`


      })
      assets[this.filename]={
        source(){
          return content
        },
        size(){
          return content.length

        }
      }

    })

  }
}


module.exports=FileListPlugin
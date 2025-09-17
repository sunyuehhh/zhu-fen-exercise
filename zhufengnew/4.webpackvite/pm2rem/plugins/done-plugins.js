const jszip=require('jszip')
const {RawSource}=require('webpack-sources')
class ArchivePlugin{
  apply(compiler){
    compiler.hooks.compilation.tap('ArchivePlugin',(compilation)=>{
      compilation.hooks.processAssets.tapPromise({name:'ArchivePlugin'},(assets)=>{
        const zip=new jszip()
        for(const pathname in assets){
          const source=assets[pathname]
          const sourceCode=source.source();//返回源代码字符串
          zip.file(pathname,sourceCode)
        }

        return zip.generateAsync({type:'nodebuffer'}).then(content=>{
          assets[`${Date.now()}.zip`]=new RawSource(content)

        })


      })

    })

  }
}

module.exports=ArchivePlugin
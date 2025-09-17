const path=require('path')
const async=require('neo-async')
class libManifestPlugin{
  constructor(options){
    this.options=options

  }

  apply(compiler){
    // 作用是在编译之后生成一个文件utils.manifest.json
    // emit将要把产出的资源写入到硬盘导航的最前最后一个钩子
    compiler.hooks.emit.tapAsync('LinManifestPlugin',(compilation,callback)=>{
      // 让所有的chunks执行任务函数 当所有任务都完成了  就会调callback
      async.forEach(compilation.chunks,(chunk,done)=>{
        const targetPath=this.options.path;//.json
        const name=this.options.name;//_dll_utils

        const content={}

        for(let module of chunk.modulesIterable){
          // libIdent是module一个属性  它是一个函数 用来返回模块ID的
          // NormalModule是有这个属性的 DllModule就没这个属性
          if(module.libIdent){
            // ident ./node_modules/_is-promise@4.0.0@is-promise/index.js
            const ident=module.libIdent({context:compiler.options.context})
            content[ident]={id:module.id}
          }
        }

        const manifest={name,content}

        compiler.outputFileSystem.mkdirp(path.dirname(targetPath),err=>{
          compiler.outputFileSystem.writeFile(
            targetPath,
            JSON.stringify(manifest),
            done
          )
        })


      },callback)


    })


  }

}


module.exports=libManifestPlugin


const DllEntryPlugin=require('./DllEntryPlugin')
const LibManifestPlugin=require('./libManifestPlugin')
class DllPlugin{
  constructor(options){
    this.options=options

  }

  // 注册插件
  apply(compiler){
    // 配置入口的
    // context项目的根目录 entry入口文件的路径  {utils:['isArray','is-promise']}
    compiler.hooks.entryOption.tap('DllPlugin',(context,entry)=>{
      Object.keys(entry).forEach(name=>{
        // context 跟目录  entry[name]=['isArray','is-promise']
        new DllEntryPlugin(context,entry[name],name).apply(compiler)
        // 此处一定要返回true 因为entryOption是一个SyncBailHook
        return true
      })


    })

    new LibManifestPlugin(this.options).apply(compiler)

  }
}

module.exports=DllPlugin
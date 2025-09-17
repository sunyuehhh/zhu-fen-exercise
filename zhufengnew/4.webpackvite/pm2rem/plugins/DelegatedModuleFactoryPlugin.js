const DelegatedModule = require("webpack/lib/DelegatedModule");

class DelegatedModuleFactoryPlugin{
  constructor(options){
    this.options=options
    options.type=options.type||'require'

  }

  apply(normalModuleFactory){
  /**
   * 监听normalModuleFactory的module这个钩子
   * 当我们这个普通模块工厂通过自己的create创建出来一个模块之后会触发这个钩子 并且把这个模块传进来
   */
    normalModuleFactory.hooks.module.tap('DelegatedModuleFactoryPlugin',(module)=>{
      // normal NormalModule
      // libIdent模块的一个属性 只有NormalModule才有 它是一个方法 可以得到模块ID
      // 模块ID默认就是此模块的路径相对于项目根目录的相对路径
      // ./normal_modules/_isarray@2.0.5@isarray/index.js
      if(module.libIdent){
        const request=module.libIdent(this.options)
        if(request&&request in this.options.content){
          const resolved=this.options.content[request];//{id:moduleId}
          return new DelegatedModule(
            this.options.source,//dll-reference _dll_utils
            resolved,//{id:moduleId}
            module//原始的NormalModule
          )

        }
      }

      // 如果不是普通模块
      return module
    })



  }

}


module.exports=DelegatedModuleFactoryPlugin
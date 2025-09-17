const DelegatedModuleFactoryPlugin = require('webpack/lib/DelegatedModuleFactoryPlugin')
const DelegatedSourceDependency=require('webpack/lib/dependencies/DelegatedSourceDependency')
const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin')
class DllReferencePlugin{
  constructor(options){
    this.options=options

  }

  apply(compiler){
    // 当webpack开启一次新的编译之后
    compiler.hooks.compilation.tap('DllReferencePlugin',(compilation,{normalModuleFactory})=>{
      // 注册依赖工厂  什么样的依赖对应什么样的模块工厂
      // DelegateSourceDependency 依赖会靠normalModuleFactory生产模块 NormalModuleFactory
      compilation.dependencyFactories.set(DelegatedSourceDependency,normalModuleFactory)


    })

    /**
     * 当开启一次新的编译的时候就会触发这个钩子
     * 1.把那些在manifest里面的模块进行特殊处理，变成代理模块
     * 2.配置external
     */
    compiler.hooks.compile.tap('DllReferencePlugin',(normalModuleFactory)=>{
      let manifest=this.options.manifest
      /**
       * external:{
       * "dll-reference _dll_utils":'_dll_utils'
       * }
       */
      let name=manifest.name
      let content=manifest.content

      let source=`dll-reference ${name}`//代理的来源模块
      const external={
        [source]:name
      }

      // 创建一个外部模块工厂插件
      // require("dll-reference _dll_utils"); module.exports=_dll_utils
      new ExternalModuleFactoryPlugin('var',external).apply(normalModuleFactory)

      // 2.创建代理模块
      new DelegatedModuleFactoryPlugin({
        source,//dll-reference _dll_utils
        context:compiler.options.context,//根目录
        content//{moduleId:{id:moduleId}}
      }).apply(normalModuleFactory)
    })
  }

}

module.exports=DllReferencePlugin
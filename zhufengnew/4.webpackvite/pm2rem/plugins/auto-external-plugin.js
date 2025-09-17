const HtmlWebpackPlugin = require("html-webpack-plugin")
const { ExternalModule } = require("webpack")

class AutoExternalPlugin{
  constructor(options){
    this.options=options
    this.externalModules=Object.keys(options)
    this.importedModules=new Set()
  }
  apply(compiler){
    // 获取到普通模块工厂 此工厂在Compiler创建的时候直接创建好了
    // 饭店=Compiler 招聘一个厨师 normalModuleFactory
    // 每当接到订单 顾客点了个蛋炒饭 或者说创建一个模块 会由厨师normalModuleFactory创建这个模块
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin',(normalModuleFactory)=>{
      // 模块工厂会负责创建模块  创建完模块要编译模块 就是把模块源码转换成语法树AST 然后遍历语法树找依赖
      normalModuleFactory.hooks.parser
      .for('javascript/auto')
      .tap('AutoExternalPlugin',(parser)=>{
        parser.hooks.import.tap('AutoExternalPlugin',(statement,source)=>{
          if(this.externalModules.includes(source))
          this.importedModules.add(source)

        })

        parser.hooks.call.for('require').tap('AutoExternalPlugin',(expression)=>{
          const source=expression.arguments[0].value
          if(this.externalModules.includes(source))
          this.importedModules.add(source)

        })

      })



    })

    // 2.改造模块的生产过程 拦截生成过程 判断如果是外部模块的化 生产一个外部模块并返回
    normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin',(resolveData,callback)=>{
      const {request}=resolveData;//获取加载的模块名 request=jquery
      // 如果这个要创建的模块是外部模块的话
      if(this.externalModules.includes(request)){
        let {variable}=this.options[request]
        callback(null,new ExternalModule(variable,'window',request))
      }else{
        callback(null)
      }


    })

    // 3.向产出的html里插入CDN的脚本
    compiler.hooks.compilation.tap('AutoExternalPlugin',(compilation)=>{
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin',(data,callback)=>{
        const {assetTags}=data
        for(key of this.importedModules){
          assetTags.scripts.unshift({
            tagName:'script',
            voidTag:false,
            attributes:{
              defer:false,
              src:this.options[key].url
            }
          })
        }
        callback(null,data)

      })

    })

  }
}


module.exports=AutoExternalPlugin
/**
 * 实现思路
 * 1.找出本项目中的所有依赖的模块 看看哪些在AutoExternalPlugin配置了
 * 也就是说看看项目里有没有使用jquery和lodash
 * 因为用到了菜需要处理为外部模块  如果没有用过就不需要任何处理
 * 2.如何找本项目依赖了哪些模块?
 * import 'lodash'
 * require('query')  callExpression
 * 所以我要找项目中的import和require语句 或者说节点
 * Compiler=>NormalModuleFactory=>Parser=>import/require
 */
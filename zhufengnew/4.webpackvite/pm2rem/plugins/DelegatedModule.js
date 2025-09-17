const Module=require('webpack/lib/Module')
const DelegatedSourceDependency=require('webpack/lib/dependencies/DelegatedSourceDependency')
class DelegatedModule extends Module{
  /**
   * 
   * @param {*} sourceRequest "dll-reference _dll_utils"
   * @param {*} data resolved={id:"./node_modules/_isarray@2.0.5@isarray/index.js"}
   * @param {*} originalModule 原始模块 normalModule {id:"./node_modules/_isarray@2.0.5@isarray/index.js"}
   */
  constructor(sourceRequest,data,originalRequest){
    super('javascript/dynamic')
    this.sourceRequest=sourceRequest
    this.request=data.id
    this.originalRequest=originalRequest


  }

  libIdent(options){//获取此模块的ID的
    return this.originalRequest.libIdent(options)

  }

  identifier(){
    return `delegated ${this.request} from ${this.sourceRequest}`
  }

  readableIdentifier(){
    return `delegated ${this.request} from ${this.sourceRequest}`
  }

  //当你先创建一个模块 然后会给这个模块进行编译
  build(options,compilation,resolver,fs,callback){
    this.built=true
    this.buildMeta={}
    this.buildInfo={}
    // 不走真正的读文件  转语法树 直接添加依赖
    this.DelegatedSourceDependency=new DelegatedSourceDependency(this.sourceRequest)
    // 把这个依赖添加当前模块的依赖数组中
    this.addDependency(this.DelegatedSourceDependency)
    callback()

  }

}

module.exports=DelegatedModule
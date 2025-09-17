const Module=require('webpack/lib/Module')
const {RawSource}=require('webpack-sources')
class DllModule extends Module{
  constructor(context,dependencies,name,type){
    super('javascript/dynamic',context)
    this.dependencies=dependencies
    this.name=name
    this.type=type

  }

  identifier(){
    return `dll ${this.name}`;//dll utils

  }

  readableIdentifier(){
    return `dll ${this.name}`;//dll utils
  }

  size(){
    return 12
  }

  source(){
    return new RawSource(`module.exports=__webpack_require__;`);
  }

  build(options,compilation,resolver,fs,callback){
    this.built=true
    this.buildMeta={}
    this.buildInfo={}
    return callback()

  }

}


module.exports=DllModule
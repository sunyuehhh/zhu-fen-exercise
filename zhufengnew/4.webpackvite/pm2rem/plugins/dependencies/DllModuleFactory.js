const {Tapable}=require('tapable')
const DllModule=require('./DllModule.js')
class DllModuleFactory{

  constructor(){
    super()
    this.hook={}
  }

  // 每个工厂都会有一个方法叫create 接受一个data对象(一般都是依赖对象) 创建一个模块 返回callback
  create(data,callback){
    // 获取到依赖数组中的第一个依赖
    const dependency=data.dependencies[0]
    callback(null,new DllModule(
      data.context,
      dependency.dependencies,
      dependency.name,
      dependency.type
    ))

  }

}

module.exports=DllModuleFactory
const Hook=require('./Hook')
const HookCodeFactory=require('./HookCodeFactory')
class ASyncParallelHookCodeFactory extends HookCodeFactory{
  content(){
    return this.callTapsParallel()
  }


}

const factory=new ASyncParallelHookCodeFactory()
class SyncHook extends Hook{
  compile(options){
    // 初始化代码工程 this就是钩子的实例  options选项{taps,args,type}
    factory.setup(this,options)
    return factory.create(options)



  }

}
module.exports=SyncHook
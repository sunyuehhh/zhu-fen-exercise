const { SyncHook } = require('tapable')
const { AsyncParallelBailHook } = require('tapable')
const {Tapable,AsyncSeriesHook,SyncBailHook}=require('tapable')
const NormalModuleFactory=require('./NormalModuleFactory')
const  Compilation = require('./Compilation')
const Stats=require('./Stats')
const mkdirp=require('mkdirp')
const path=require('path')
class Compiler extends Tapable {
  constructor(context){
    super()
    this.context=context
    this.hooks={
      // context项目 根目录绝对路径  entry入口文件路径  ./src/index.js
      entryOption:new SyncBailHook(['context','entry']),
      beforeRun:new AsyncSeriesHook(['compiler']),//运行前
      run:new AsyncSeriesHook(['compiler']),//运行
      beforeCompile:new AsyncSeriesHook(['params']),//编译前
      compile:new SyncHook(['params']),//编译
      make:new AsyncParallelBailHook(["compilation"]),
      thisCompilation:new SyncHook(['compilation','params']),//创建完成一个新的compilation
      compilation:new SyncHook(['compilation','params']),//创建完成一个新的compilation
      afterCompile:new AsyncSeriesHook(['compilation']),//编译完成
      emit:new AsyncSeriesHook(['compilation']),//发射或者写入
      done:new AsyncSeriesHook(["stats"])//所有的编译全部都完成

    }

  }

  emitAssets(compilation,callback){
      console.log('onCompiled')
      // finalCallback(err,{
      //     entries:[],//显示所有的入口
      //     chunks:[],//显示所有的代码块
      //     module:[],//显示所有模块
      //     assets:[]//显示所有打包后的资源 也就是文件
      //   })
        // finalCallback(err,new Stats(compilation))
      // 把chunk变成文件  写入硬盘
      const emitFiles=(err)=>{
        const assets=compilation.assets;
        let outputPath=this.options.output.path;//dist
        for(let file in assets){
          let source=assets[file]
          let targetPath=path.posix.join(outputPath,file)
          this.outputFileSystem.writeFileSync(targetPath,source,'utf8')
        }

      }
      // 先触发emit的回调 在写插件的时候emit用的很多 因为它是我们修改输出内容的最后机会
      this.hooks.emit.callAsync(compilation,()=>{
        // 先创建输出目录dist 再写入文件
        mkdirp(this.options.output.path,emitFiles)

      })
  }

  // run方法是开始编译的入口
  run(callback){
    console.log('Compiler run')

    // 这是编译完成最终的回调函数
    const finalCallback=(err,stats)=>{
      callback(err,stats)

    }

    const onCompiled=(err,compilation)=>{
      this.emitAssets(compilation,err=>{
        // 
        let stats=new Stats(compilation)
        this.hooks.done.callAsync(stats,err=>{
          callback(err,stats)
        })

      })

    }

    this.hooks.beforeRun.callAsync(this,err=>{
      this.hooks.run.callAsync(this,err=>{
        this.compile(onCompiled)
      })
    })


  }

  compile(onCompiled){
    const params=this.newCompilationParams()
    this.hooks.beforeCompile.callAsync(params,err=>{
      this.hooks.compile.call(params)
      const compilation=this.newCompilation(params)
      this.hooks.make.callAsync(compilation,err=>{
        // console.log('make完成')
        // onCompiled(err,compilation)
        // 封装代码块之后编译就完成了
        compilation.seal(err=>{
          // 触发编译完成的钩子
          this.hooks.afterCompile.callAsync(compilation,(err)=>{
            onCompiled(err,compilation)

          })
        })
      })
    })

  }

  newCompilation(params){
    const compilation=this.createCompilation()
    this.hooks.thisCompilation.call(compilation,params)
    this.hooks.compilation.call(compilation,params)

    return compilation
  }

  createCompilation(){
    return new Compilation(this)

  }

  newCompilationParams(){
    const params={
      // 在创建compilation前已经创建了一个普通模块了
      normalModuleFactory:new NormalModuleFactory()
    }

    return params
  }

  
}


module.exports=Compiler
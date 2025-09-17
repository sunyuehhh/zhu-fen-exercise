const {Tapable, SyncHook}=require('tapable')
const NormalModuleFactory=require('./NormalModuleFactory')
const normalModuleFactory=new NormalModuleFactory()
const path=require('path')
const Parser=require('./Parser')
const async=require('neo-async')
const Chunk=require('./Chunk')
const ejs=require('ejs')
const fs=require('fs')
const mainTemplate=fs.readFileSync(path.join(__dirname,'template','main.ejs'),'utf8')
const mainRender=ejs.compile(mainTemplate)
const chunkTemplate=fs.readFileSync(path.join(__dirname,'template','chunk.ejs'),'utf8')
const chunkRender=ejs.compile(chunkTemplate)



const parser=new Parser()

class Compilation extends Tapable{
  constructor(compiler){
    super()
    this.compiler=compiler;//编译器对象
    this.options=compiler.options;//选项一样
    this.context=compiler.context;//根目录
    this.inputFileSystem=compiler.inputFileSystem;//读取文件模块fs
    this.outputFileSystem=compiler.outputFileSystem;//写入文件的模块fs
    this.entries=[];//入口模块的数组 这里放置所有的入口模块
    this.modules=[];//模块的数组 这里放着所有的模块
    this._modules={};//key模块ID 值是模块的模块对象

    this.chunks=[];//这里放的所有的代码块
    this.files=[];//这里放着本次编译所有的产出的文件名

    this.assets={}

    this.hooks={
      // 当你成功构建完成一个模块后就会触发此钩子的执行
      succeedModule:new SyncHook(['module']),
      seal:new SyncHook(),
      beforeChunks:new SyncHook(),
      afterChunks:new SyncHook()
    }



  }

  /**
   * 开始编译一个新的入口
   * @param {*} context 根目录
   * @param {*} entry 入口模块的相对路径  ./src/index.js
   * @param {*} name  入口的名字  main
   * @param {*} callback 编译完成的回调
   */
  addEntry(context,entry,name,finalCallback){
    this._addModuleChain(context,entry,name,false,(err,module)=>{
      finalCallback(err,module)

    })

  }

  _addModuleChain(context,rawRequest,name,async,callback){
    this.createModule({
      name,
      context,
      rawRequest,
      parser,
      resource:path.posix.join(context,rawRequest),
      moduleId:'./'+path.posix.relative(context,resource),
      async
    },entryModule=>this.entries.push(entryModule),callback)

  }

  /**
   * 创建并编译一个模块
   * @param {*} data 要编译的模块信息
   * @param {*} addEntry 可选的增加入口的方法 如果这个模是入口模块  如果不是的话 就什么都不做
   * @param {*} callback 
   */
  createModule(data,addEntry,callback){
    // 通过模块工厂创建一个模块
    let module = normalModuleFactory.create(
      data
    //   {
    //   name,//main
    //   context,//根目录  TODO
    //   RawRequest:entry,//./src/index.js
    //   resource:path.posix.join(context,entry),//入口的绝对路径
    //   parser
    // }
  )
  // module.moduleId='./'+path.posix.relative(this.context,module.resource)// ./src/index.js

  addEntry&&addEntry(module)

    // this.entries.push(entryModule);//给入口模块数组添加一个模块
    this.modules.push(module);//给普通模块数组添加一个模块
    this._modules[module.moduleId]=module;//保存一下对应信息

    const afterBuild=(err,module)=>{
      // 如果大于0 说明有依赖
      if(module.dependencies.length>0){
        this.processModuleDependencies(module,err=>{
          callback(err,module)
        })
      }else{
          callback(err,module)
      }
      // return callback(err,entryModule)

    }

    this.buildModule(module,afterBuild)
  }

    /**
   * 处理编译模块依赖
   * @param {*} module   ./src/index.js
   * @param {*} callback 
   */
  processModuleDependencies(module,callback){
    // 1.获取当前模块的依赖模块
    let dependencies=module.dependencies
    // 遍历依赖模块 全部开始编译 当所有的依赖模块全部编译完成后才调用callback
    async.forEach(dependencies,(dependency,done)=>{
      let {name,context,rawRequest,resource,moduleId}=dependency
      this.createModule({
        name,
        context,
        rawRequest,
        parser,
        resource,
        moduleId
      },null,callback)
    },callback)

  }

  buildModule(module,afterBuild){
    console.log(module,'module')
    // 模块的真正的编译逻辑其实放在module内部完成
    module.build(this,(err)=>{
      // 走到这里意味着一个module模块已经编译完成了
      this.hooks.succeedModule.call(module)
      afterBuild(err,module)


    })

  }

  /**
   * 把模块封装成代码块Chunk
   * @param {*} callback 
   */
  seal(callback){
    this.hooks.seal.call()
    this.hooks.beforeChunks.call();//开始准备生成代码块
    // 一般来说 默认情况下  每一个入口会生成一个代码块
    for(const entryModule of this.entries){
      const chunk=new Chunk(entryModule);//根据入口模块得到一个代码块
      this.chunks.push(chunk)
      // 对所有模块进行过滤 找出来那些名称跟这个chunk一样的模块 组成一个数组赋给chunk.modules
      chunk.modules=this.modules.filter(module=>module.name===chunk.name)
    }

    this.hooks.afterChunks.call(this.chunks)
    // 生成代码块之后 要生成代码块对应资源
    this.createChunkAssets()
    callback()

  }

  createChunkAssets(){
    for(let i=0;i<this.chunks.length;i++){
      const chunk=this.chunks[i]
      const file=chunk.name+'.js';//只是拿到文件名
      chunk.files.push(file)
      let source;
      if(chunk.async){
      source=chunkRender({
        chunkName:chunk.name,//./src/index.js
        modules:chunk.modules//此代码块对应的模块数组[{moduleId:'./src/index.js'}]
      });
      }else{
      source=mainRender({
        entryModuleId:chunk.entryModule.moduleId,//./src/index.js
        modules:chunk.modules//此代码块对应的模块数组[{moduleId:'./src/index.js'}]
      });
      }
      this.emitAssets(file,source)
    }

  }

  emitAssets(file,source){
    this.assets[file]=source
    this.files.push(file)

  }



}


module.exports=Compilation
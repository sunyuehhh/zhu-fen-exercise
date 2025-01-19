/**
 * 根据loader的绝对路径创建loader对象
 * @param {*} loaderAbsPath 
 */
function createLoaderObject(loaderAbsPath){
  const normal=require(loaderAbsPath)
  const pitch=normal.pitch
  // 如果设置normal.raw属性为true的话，那么loader的normal函数参数就是一个Buffer,否则就是一个字符串
  const raw=normal.raw

  return {
    path:loaderAbsPath,
    normal,
    pitch,
    raw,
    data:{},//每个loader都有一个自己的自定义对象，可以用来保存和传递数据
    pitchExecuted:false,//表示此loader的pitch已经执行过了
    normalExecuted:false//表示此loader的normal函数已经执行过了
  }
}
function runLoaders(options,finalCallback){
  // resource要处理的资源   或者说要编译的模块路径
  // loaders处理此路径的loaders
  // context指的是loader函数再执行的时候的this指针
  // readResource读取文件的方法  fs.readFile
  let {resource,loaders=[],context={},readResource}=options
  // loaders现在是一个loader模块的绝对路径，转成一个对象
  const loaderObjects = loaders.map(createLoaderObject)
  const loaderContext=context;//这个对象就是loader执行时候的this指针

  loaderContext.resource=resource//加载的模块
  loaderContext.readResource=readResource//读取文件的方法
  loaderContext.loaders=loaderObjects;//存放loaders对象数组

  loaderContext.loaderIndex=0;//当前正在处理的loader的索引
  loaderContext.callback=null;//可以手工调用此方法向后执行下一个loader
  loaderContext.async=null;//可以把loader运行从同步变为异步,并返回this.callback

  // 代表整个请求
  Object.defineProperty(loaderContext,'request',{
    get(){
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders.map(loader=>loader.path).concat(loaderContext.resource).join("!")
    }
  })

  Object.defineProperty(loaderContext,'remainingRequest',{
    get(){
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders.slice(loaderContext.loaderIndex+1).map(loader=>loader.path).concat(loaderContext.resource).join("!")
    }
  })

    Object.defineProperty(loaderContext,'currentRequest',{
    get(){
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders.slice(loaderContext.loaderIndex).map(loader=>loader.path).concat(loaderContext.resource).join("!")
    }
  })

  Object.defineProperty(loaderContext,'previousRequest',{
    get(){
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders.slice(0,loaderContext.loaderIndex).map(loader=>loader.path).join("!")
    }
  })

  Object.defineProperty(loaderContext,'data',{
    get(){
      return loaderContext.loaders[loaderContext.loaderIndex].data
    }
  })

  const processOptions={
    readResource,//fs.readFile
    resourceBuffer:null,//要读取资源的原地阿玛，它是一个Buffer,就是二进制数组

  }

  iteratePitchingLoaders(processOptions,loaderContext,(err,result)=>{
    finalCallback(err,{
      result,//就是最终处理的结果，其实就是最左侧的loader的normal返回值
      resourceBuffer:processOptions.resourceBuffer
    })
  })

}
/**
 * 转换loader的参数
 * @param {*} args 参数
 * @param {*} raw 布尔值,表示loader想要字符串还是想要Buffer
 */
function convertArgs(args,raw){
  if(raw&&!Buffer.isBuffer(args[0])){
    args[0]=Buffer.from(args[0])

  }else if(!raw&&Buffer.isBuffer(args[0])){
    args[0]=args[0].toString()

  }


}

function runSyncOrAsync(fn,loaderContext,args,runCallback){
  let isSync=true;//默认fn的执行是同步的
  let isDone=false;//表示当前的函数是否已经完成了
  loaderContext.callback=(err,...args)=>{
    if(isDone){
      throw new Error('已经完成过了,不能再调用callback了')
    }
    runCallback(err,...args)
  }
  loaderContext.async=()=>{
    isSync=false
    return loaderContext.callback
  }
  let result=fn.apply(loaderContext,args)
  // 如果当前的执行是同步的话
  if(isSync){
    callback(null,result)
    isDone=true
  }
  // 如果是异步,不会立即调用runCallback,需要你再loader的内部手工触发callback,然后来执行runCallback
}

function iterateNormalLoaders(processOptions,loaderContext,args,pitchingCallback){
  if(loaderContext.loaderIndex<0){
    return pitchingCallback(null,args)
  }
  let currentLoader=loaderContext.loader[loaderContext.loaderIndex]
  if(currentLoader.normalExecuted){
    loaderContext.loaderIndex--
    return iterateNormalLoaders(processOptions,loaderContext,args,pitchingCallback)
  }
  let fn=currentLoader.normal
  currentLoader.normalExecuted=true
  convertArgs(args,currentLoader.raw)
  // 要以同步或者异步的方式执行fn
  runSyncOrAsync(fn,loaderContext,args,(err,...returnArgs)=>{
    if(err) pitchingCallback(err)
    // TODO

  })
}

function processResource(processOptions,loaderContext,pitchingCallback){
  processOptions.readResource(loaderContext.resource,(err,resourceBuffer)=>{
    processOptions.resourceBuffer=resourceBuffer//要加载的资源  二进制数组 Buffer
    loaderContext.loaderIndex--;
    // 迭代loader
    iterateNormalLoaders(processOptions,loaderContext,[resourceBuffer],pitchingCallback)

  })
}


function iteratePitchingLoaders(processOptions,loaderContext,pitchingCallback){
  if(loaderContext.loaderIndex>=loaderContext.loaders.length){
    // pitch执行完毕了，需要读取文件
    return processResource(processOptions,loaderContext,pitchingCallback)
  }
  // 获取当前是索引对应的loader对象
  let currentLoader=loaderContext.loaders[loaderContext.loaderIndex]
  if(currentLoader.pitchExecuted){
    loaderContext.loaderIndex++
    return iteratePitchingLoaders(processOptions,loaderContext,pitchingCallback)
  }
  let fn=currentLoader.pitch
  currentLoader.pitchExecuted=true
  if(!fn){
    loaderContext.loaderIndex++
    return iteratePitchingLoaders(processOptions,loaderContext,pitchingCallback)
  }
  runSyncOrAsync(fn,loaderContext,[
    loaderContext.remainingRequest,
    loaderContext.previousRequest,
    loaderContext.data
  ],(err,...runArgs)=>{
    // 判断pitch方式的返回值有没有，如果有则跳过后面的loader，返回头执行前一个loader
    if(runArgs.length>0&&runArgs.some(item=>item)){
      loaderContext.loaderIndex--
      iterateNormalLoaders(processOptions,loaderContext,args,pitchingCallback)

    }else{
      return iteratePitchingLoaders(processOptions,loaderContext,pitchingCallback)
    }
  })

}

exports.runLoaders=runLoaders
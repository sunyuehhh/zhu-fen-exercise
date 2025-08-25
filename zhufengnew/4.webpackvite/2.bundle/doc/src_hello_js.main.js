window['webpackChunk_2_bundle'].push(["src_hello_js"],{
  "./src/hello.js":(module,exports,require)=>{
    require.r(exports);//表示原来它是一个es module
    require.d(exports,{
      "default":()=>_DEFAULT_EXPORT__
    })

    const _DEFAULT_EXPORT__='hello'

  }
})




function webpackJsonpCallback([chunkIds,moreModules]){
  const resolves=[]
  for(let i=0;i<chunkIds.length;i++){
    const chunkId=chunkIds[i]
    resolves.push(installedChunks[chunkId][0])
    installedChunks[chunkId]=0
  }

  for(const moduleId in moreModules){
    modules[moduleId]=moreModules[moduleId]
  }

  // 依次取出promise的resolve方法 让它对应的promise变成成功态
  while(resolves.length>0){
    resolves.shift()();
  }


}

//已经安装过的  或者说已经加载好的代码块
// key是代码块的名字  值是代码块的状态
// main就是默认代码块的名称  0表示已经加载完成
var installedChunks={
  main:0,
  // 当一个代码块它的值是一个数组的时候表示此代码对应的JS文件正在加载中
  // 'src_hello_js':[resolve,reject,promise]
}

require.f={}
require.p='';//publicPath文件访问路径
require.u=(chunkId)=>chunkId+'.js'


require.l=(url)=>{
  let script=document.createElement('script')
  script.src=url
  document.head.appendChild(script)

}



// jsonp 通过JSONP的方式加载chunkId对应的JS文件  生成一个promise放到promises数组里
require.f.j=(chunkId,promises)=>{
  let installedChunkData;
  const promise=new Promise((resolve,reject)=>{
    installedChunkData=installedChunks[chunkId]=[resolve,reject]

  })

  installedChunkData[2]=promise
  promises.push(promise)
  const url=require.p+require.u(chunkId)
  require.l(url)

}

require.e=(chunkId)=>{
  let promises=[]
  require.f.j(chunkId,promises)
  return Promise.all(promises)

}


chunkLoadingGlobal.push=webpackJsonpCallback;

const chunkLoadingGlobal=window['webpackChunk_2_bundle']=[]

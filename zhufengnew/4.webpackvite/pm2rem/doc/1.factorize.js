const {AsyncSeriesBailHook}=require('tapable')
const factorize=new AsyncSeriesBailHook(['resolveData'])

factorize.tapAsync('externalModuleFactory',(resolveData,callback)=>{
  if(resolveData==='jquery'){
    let externalModule={
      id:resolveData,
      type:'外部模块',
      source:'window.$'
    }

    callback(null,externalModule)
  }else{
    callback(null)
  }

})

factorize.tapAsync('normalModuleFactory',(resolveData,callback)=>{
  let normalModule={
    id:resolveData,
    type:'正常模块',
    source:'正常打包的内容'
  }

  callback(null,normalModule)

})

factorize.callAsync('jquery',(err,module)=>{
  console.log(module,'module jquery')

})

factorize.callAsync('lodash',(err,module)=>{
  console.log(module,'module lodash')

})
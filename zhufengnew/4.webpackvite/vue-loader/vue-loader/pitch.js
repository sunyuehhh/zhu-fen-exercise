const {stringifyRequest} =require('./utils')
const pitcher=code=>code
const isNotPitcher=loader=>loader.path!==__filename

const pitch=function(){
  const loaderContext=this
  const loaders=loaderContext.loaders.filter(isNotPitcher)
  const query=new URLSearchParams(loaderContext.resourceQuery.slice(1))
  return genProxyModule(loaders,loaderContext)

}

function genProxyModule(loaders,loaderContext){
  const request=genRequest(loaders,loaderContext)
  return `export {default} from ${request}`

}

function genRequest(loaders,loaderContext){
  // loader.request是loader文件的绝对路径  \vue-loader\index.js
  const loaderStrings=loaders.map(loader=>loader.request)
  // 要加载的资源的绝对路径   \App.vue?vue&type=script
  const resource=loaderContext.resourcePath+loaderContext.resourceQuery
  // 在前面加上关键字 是为了忽略配置文件中的loader
  return stringifyRequest(loaderContext,'!!'+[...loaderStrings,resource].join('!'))

}


pitcher.pitch=pitch
module.exports=pitcher
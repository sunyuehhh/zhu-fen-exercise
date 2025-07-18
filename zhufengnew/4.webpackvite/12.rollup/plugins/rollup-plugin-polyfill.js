const PROXY_SUFFIX='?inject-polyfill'
const POLYFILL_ID='\0polyfill'
const path=require('path')
function polyfill(){
  return {
    name:'inject-polyfill',//插件的名字

  async resolveId(source,importer,options){
    if(source===POLYFILL_ID){
      return {
        id:POLYFILL_ID,
        moduleSideEffects:true
      }
    }
    if(option.isEntry){//说明这是一个入口点
      // 查找模块的ID 或者所文件名  或者说此模块的文件的绝对路径
      const resolution=await this.resolve(source,importer,
        {
          skipSelf:true,
          ...options
        }
      )

      console.log('resolution',resolution)
      // 如果此模块无法解析 或者是外部模块  要直接返回  rollup会报错或进行提示
      if(!resolution||resolution.external){
        return resolution
      }

      // 加载模块内容
      const moduleInfo=await this.load(resolution)
      // 表示此模块有副作用  不要tree shaking
      moduleInfo.moduleSideEffects=true
      // src/index.js?inject-polyfill
      return `${resolution.id}${PROXY_SUFFIX}`


    }

    return null

  },
  load(id){
    if(id===POLYFILL_ID){
      return `console.log('腻子代码')`
    }
    // 如果是一个需要代理得入口  特殊 处理  下 生成一个中间得代理模块
    if(id.endsWith(PROXY_SUFFIX)){
      // src/index.js
      const entryId=id.slice(0,-PROXY_SUFFIX.length)
      let code=`
              import ${JSON.stringify(POLYFILL_ID)};
              export * from ${JSON.stringify(entryId)}
      `
      // 如果钩子有返回值了  不去走后面得load钩子了 也不会读硬盘上得文件了   webpack loader pitch
      return code
    }

    return null

  }



}


}

let plugins=[
  {
    resolveId:()=>'xxx'
  },
  {
    resolveId:()=>'yyy'
  }
]
function resolve(source,importer,options){
  // 再resolve得过程 也会遍历所有的插件的resolveId方法
  let resolution;
  for(let i=0;i<plugins.length;i++){
    const resolveId=plugins[i].resolveId;
    if(resolveId){
      resolution=resolveId(source,importer)
      if(resolution) return resolution
    }
  }
  return {
    id:path.resolve(path.dirname(importer),source)
  }

}

export default polyfill

/**
 * resolveId 查找引入的模块的绝对路径
 */
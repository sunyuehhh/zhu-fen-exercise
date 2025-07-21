const { normalizePath } = require("./utils")


/**
 * 创建插件的容器
 * @param {*} 
 * plugins:插件的数组 它的格式和rollup的插件是一样的{name，resolveId}
 * root:根目录 
 * @returns 
 */
const createPluginContainer=async ({plugins})=>{
  const container={
    async resolveId(path,importer){
      let resolved=path
      for(const plugin of plugins){
        if(!plugin.resolveId) continue
        const result=await plugin.resolveId.call(null,path,importer)
        if(result){
          resolved=result.id||result
          break
        }
      }

      return {
        id:normalizePath(resolved)
      }

    },
    async load(id){
      for(const plugin of plugins){
        if(!plugin.load) continue
        const result=await plugin.resolveId.call(null,id)
        if(result){
          return result
        }

      }

      return null

    },
    async transform(code,id){
      for(const plugin of plugins){
        if(!plugin.transform) continue
        const result=await plugin.transform.call(null,code,id)
        if(!result){
          continue
        }else{
          code=result.code||result 
        }

      }

      return {code}
    }
  }

  return container

}



exports.createPluginContainer=createPluginContainer
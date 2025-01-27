const { normalizePath } = require("../utils");

/**
 * 创建插件的容器   
 * @param plugins  插件的数组  它的格式和rollup的插件是一样的
 * @param root  根目录
 * @returns 容器对象
 */
async function createPluginContainer({plugins,root}){
  // 插件上下文
  class PluginContext{
    async resolve(id,importer){
      return await container.resolveId(id,importer)

    }
  }
  const container={
    async resolveId(path,importer){
      let resolved=path
      const ctx=new PluginContext()
      for(const plugin of plugins){
        if(!plugin.resolveId) continue;
        const result=await plugin.resolveId.call(ctx,path,importer)
        if(result){
          resolved=result.id||result;
          break
        }
      }

      return {
        id:normalizePath(resolved)
      }

    },
    async load(id){
      const ctx=new PluginContext()
      for(const plugin of plugins){
        if(!plugin.load) continue;
        const result=await plugin.load.call(ctx,id)
        if(result){
         return result
        }
      }
      return null
    },
    async  transform(code,id){
      const ctx=new PluginContext()
      for(const plugin of plugins){
        if(!plugin.transform) continue;
        const result=await plugin.transform.call(ctx,code,id)
        if(!result){
         continue
        }else{
          code=result.code||result
        }
      }
      return {
        code
      }
    }


  }
  return container

}



exports.createPluginContainer=createPluginContainer
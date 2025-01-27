const { normalizePath } = require("../utils");

/**
 * 创建插件的容器   
 * @param plugins  插件的数组  它的格式和rollup的插件是一样的
 * @param root  根目录
 * @returns 容器对象
 */
async function createPluginContainer({plugins,root}){
  const container={
    async resolveId(path,importer){
      let resolved=path
      for(const plugin of plugins){
        if(!plugin.resolveId) continue;
        const result=await plugin.resolveId.call(null,path,importer)
        if(result){
          resolved=result.id||result;
          break
        }
      }

      return {
        id:normalizePath(resolved)
      }

    }


  }
  return container

}



exports.createPluginContainer=createPluginContainer
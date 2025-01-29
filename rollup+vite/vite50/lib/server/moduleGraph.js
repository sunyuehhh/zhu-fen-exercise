/**
 * 模块节点：代表一个模块
 */
class ModuleNode{
  // 哪些模块导入了自己   renderModule就被main.js导入了
  importers=new Set()
  // 我这个模块可以接收哪些模块的修改
  acceptedHmrDeps=new Set()

  constructor(url){
    this.url=url

  }

}



/**
 * 模块依赖图  提供模块ID到模块节点的映射
 */
class ModuleGraph{
  constructor(resolveId){
    this.resolveId=resolveId
    
  }
  // 模块ID和模块节点的映射关系
  idToModuleMap=new Map()
  // 根据模块id返回模块的节点的对象
  getModuleById(id){
    return this.idToModuleMap.get(id)

  }
  async ensureEntryFromUrl(rawUrl){//vue   /src/main.js
    // 先获取它的绝对路径
    const [url,resolveId]=await this.resolveUrl(rawUrl)
    let moduleNode=this.idToModuleMap.get(resolveId)
    if(!moduleNode){
      moduleNode=new ModuleNode(url)
      this.idToModuleMap.set(resolveId,moduleNode)
    }

    return moduleNode

  }

  async resolveUrl(url){
    const resolved=await this.resolveId(url)
    return [url,resolved?.id||resolved]

  }

  async updateModuleInfo(importerModule,importedUrls,acceptedUrls){
    for(const importedUrl of importedUrls){
      const depModule=await this.ensureEntryFromUrl(importedUrl)
      // 依赖方的导入模块就是importerModule
      depModule.importers.add(importerModule)
    }

    const acceptedHmrDeps=importerModule.acceptedHmrDeps
    for(const acceptedUrl of acceptedUrls){
      const acceptedModule=await this.ensureEntryFromUrl(acceptedUrl)
      acceptedHmrDeps.add(acceptedModule)
    }



  }

}


exports.ModuleGraph=ModuleGraph
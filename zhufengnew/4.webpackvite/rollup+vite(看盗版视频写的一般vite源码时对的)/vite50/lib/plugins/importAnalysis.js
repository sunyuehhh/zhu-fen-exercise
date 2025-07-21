const {init,parse}=require('es-module-lexer')
const MagicString=require('magic-string')
const {lexAcceptedHmrDeps}=require('../server/hmr')
function importAnalysis(config){
  const {root}=config
  let server;
  return {
    name:'importAnalysis',
    configureServer(_server){
      server=_server
    },
    // 找到源文件中第三方模块进行转换   vue=>deps/vue.js
    async transform(source,importer){
      console.log(source,importer,'importAnalysis')
      await init;//等待解析器完成
      // 获取导入模块
      let imports=parse(source)[0]
      // 如果没有导入任何模块，可以直接返回
      if(!imports?.length){
        return source
      }

      const {moduleGraph}=server
      // 根据导入方的模块路径获取模块节点
      const importerModule=moduleGraph.getModuleById(importer)
      // 此模块将要导入的子模块
      const importedUrls=new Set()//renderModule.js
      // 接收变更的依赖模块
      const acceptedUrls=new Set()//renderModule.js







      // url=vue=>/node_modules/.vite/deps/vue.js
      const normalizeUrlFun=async (url)=>{
        // 内部其实是调用插件容器的resolveId方法返回url的绝对路径
        const resolved=await this.resolve(url,importer);
        if(resolved&&resolved.id.startsWith(root)){
          url=resolved.id.slice(root.length)
        }

        await moduleGraph.ensureEntryFromUrl(url)//建立此导入的模块和模块节点的对应关系
        return url
        // if(url=='vue'){
        //   return '/node_modules/.vite50/deps/vue.js'
        // }else{
        //   return url
        // }
      }
      const ms=new MagicString(source)
      // 重写路径
      for(let index=0;index<imports.length;index++){
        // n=specifier=vue
        const {s:start,e:end,n:specifier}=imports[index]

        const rawUrl=source.slice(start,end);//原始的引入地址  import.meta  import.meta.hot.accept(['./renderModule.js'],
        if(rawUrl==='import.meta'){
          const prop=source.slice(end,end+4)
          if(prop=='.hot'){
            // 热更新的调用
            if(source.slice(end+4,end+11)==='.accept'){
              // 此处存放的是原始路径  相对路径,也可能是绝对  也可能是第三方的
              lexAcceptedHmrDeps(source,source.indexOf('(',end+11)+1,acceptedUrls)


            }
          }

        }

        if(specifier){
          const normalizeUrl=await normalizeUrlFun(specifier)
          if(specifier!==normalizeUrl){
            ms.overwrite(start,end,normalizeUrl)
          }

          
          // 把解析后的导入的模块ID添加到importUrls
          importedUrls.add(normalizeUrl)

        }
      }

      const normalizedAcceptedUrls=new Set()
      for(const {url,start,end} of acceptedUrls){
      // const [rawUrl,normalized] = await moduleGraph.resolveUrl(url)
      // normalizedAcceptedUrls.add(normalized)
      normalizedAcceptedUrls.add(url)
      ms.overwrite(start,end,JSON.stringify(normalized))
      }

      // 更新模块的依赖信息
      await moduleGraph.updateModuleInfo(importerModule,importedUrls,normalizedAcceptedUrls)

      return ms.toString()




    }
  }

}


module.exports=importAnalysis
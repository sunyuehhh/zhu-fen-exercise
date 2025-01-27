const {init,parse}=require('es-module-lexer')
const MagicString=require('magic-string')
function importAnalysis(config){
  const {root}=config
  return {
    name:'importAnalysis',
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
      // url=vue=>/node_modules/.vite/deps/vue.js
      const normalizeUrlFun=async (url)=>{
        // 内部其实是调用插件容器的resolveId方法返回url的绝对路径
        const resolved=await this.resolve(url,importer);
        if(resolved&&resolved.id.startsWith(root)){
          url=resolved.id.slice(root.length)
        }
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
        if(specifier){
          const normalizeUrl=await normalizeUrlFun(specifier)
          if(specifier!==normalizeUrl){
            ms.overwrite(start,end,normalizeUrl)
          }
        }
      }

      return ms.toString()




    }
  }

}


module.exports=importAnalysis
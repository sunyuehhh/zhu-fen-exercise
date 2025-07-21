const {init,parse}=require('es-module-lexer')
const MagicString=require('magic-string')
function importAnalysis(config){
  const {root}=config
  return {
    name:'importAnalysis',
    // 1.找到源文件中第三方模块  2.进行转换  vue=>deps/vue.js
    async transform(source,importer){
      await init;//等待解析器初始化完成
      // 获取导入的模块
      // let imports=parse(source)[0]
      console.log(source,'source')
      const [imports] = await parse(source)
      // 如果没有导入任何模块 可以直接返回

      if(!imports?.length){
        return source
      }

      const normalizedUrlFun=async (url)=>{
        // if(url==='vue'){
        //   return '/node_modules/.vite50/deps/vue.js'
        // }else{
        //   return url
        // }

        const resolved=await this.resolve(url,importer)
        if(resolved&&resolved.id.startsWith(root)){
          url=resolved.id.slice(root.length)
        }

        return url

      }


      const ms=new MagicString(source)
      // 重写路径
      for(let index=0;index<imports.length;index++){
        // n=specifier=vue
        const {s:start,e:end,n:specifier}=imports[index]
        if(specifier){
          const normalizedUrl=await normalizedUrlFun(specifier)
          if(specifier!==normalizedUrl){
            ms.overwrite(start,end,normalizedUrl)
          }
        }
      }

      console.log(ms.toString(),'ms.toString()')

      return ms.toString()
    }
  }

}


module.exports=importAnalysis
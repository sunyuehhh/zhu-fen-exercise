const PROXY_SUFFIX='?inject-polyfill'
const POLYFILL_ID=`\0polyfill`//如果你的模块使用"虚拟模块"(例如，用于辅助功能)，请在模块ID前面加入\0,这会祖师其他插件尝试处理它
function polyfill(){
  return {
    name:'inject-polyfill',//原理  代理一个模块实现的
    async resolveId(source,importer,options){
      if(source==POLYFILL_ID){
        return {id:POLYFILL_ID,moduleSideEffects:true}
      }
      if(options.isEntry){//说明这是一个入口点
        // pluginContext.resolve 将导入接续未模块ID(即文件名)
        const resolution=await this.resolve(source,importer,{skipSelf:true,...options})
        console.log(resolution,'resolution')
        // 如果此模块无法解析   或者是外部模块  要直接返回  rollup会报错或进行提示
        if(!resolution||resolution.external){
          return resolution
        }
        // 加载模块内容
        // 1.读取模块内容  触发load钩子  2.转换模块内容  触发transform钩子  3.模块恐鳄蜥  ast  分析ast
        const moduleInfo=await this.load(resolution)
        // 表示此模块有副作用 不需要tree shaking 
        moduleInfo.moduleSideEffects=true

        console.log(`${resolution.id}${PROXY_SUFFIX}`)
        // D:\xuexishipin\exercise\zhu-fen-exercise\rollup+vite\13.rollup\src\index.js?inject-polyfill
        return `${resolution.id}${PROXY_SUFFIX}`
        
      }

    },
    async load(id){
      if(id==POLYFILL_ID){
        return `console.log('腻子代码')`
      }
      // 如果是一个需要代理的入口  特殊处理   生成一个中间的代理模块
      if(id.endsWith(PROXY_SUFFIX)){
        const entryId=id.slice(0,-PROXY_SUFFIX.length)
        let code=`
        import ${JSON.stringify(POLYFILL_ID)};
        export * from ${JSON.stringify(entryId)}
        `
        return code
      }
        // 如果钩子有返回值了，不去走后面的load钩子了，也不会读硬盘的文件了
      return null

    }

  }
}

export default polyfill

/**
 * resolveId   查找引入模块的绝对路径
 */

/**
 * this.resolve的返回结果
 * {
  external: false,//是否是外部模块
  id: 'D:\\xuexishipin\\exercise\\zhu-fen-exercise\\rollup+vite\\13.rollup\\src\\index.js',  //此模块的绝对路径
  moduleSideEffects: true,//模块是否有副作用  有副作用的话会进入treeshaking 
} 
 */

/**
 * 默认情况下，rollup只认相对路径，不认识第三方模块  如果遇到第三方模块 会认为是外部依赖
 */
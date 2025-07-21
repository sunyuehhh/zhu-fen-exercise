function build(pluginOptions){
  return {
    name:'build',
    options(options){
      console.log('options')
      // 此钩子一般不使用，因为它是在汇总配置前执行
      return {...options}
    },
    buildStart(inputOptions){
      // 入宫你向读取所有的插件的配置内容的魂宗，需要buildStart
      console.log('buildStart')
    },
    async resolveId(source,importer){
      console.log(source,importer,'resolveId')

    },
    async load(id){
      console.log('load',id)
    },
    async transform(code,id){
      console.log('transform',code,id)

    },
    shouldTransformCacheModule({code,id}){
      console.log('shouldTransformCacheModule',code,id)
      return true   //每次从缓存在加载都需要重新转换
    },
    async moduleParsed(moduleInfo){
      console.log('moduleParse',moduleInfo)

    },
    async resolveDynamicImport(specifier,importer){
      console.log('resolveDynamicImport',specifier,importer)

    },
    buildEnd(){
      console.log('buildEnd')
    }
  }

}


export default build
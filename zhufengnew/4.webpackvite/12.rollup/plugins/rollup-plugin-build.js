function build(){
  return {
    name:'build',
    options(options){
      console.log('options')

      return {...options,extValue:'value'}
    },
    buildStart(inputOptions){
      // 如果你想读取所有的插件的配置内容的汇总 需要buildStart
      console.log('buildStart',inputOptions)
    },
    async resolveId(source,importer){
      console.log(source,importer)
    },
    async load(id){
      console.log('load',id)
    },
    async shouldTransformCachedModule({id,code}){
      console.log('shouldTransformCachedModule',code,id)

    },
    async transform(code,id){
      console.log('transform',code,id)

    },
    async moduleParsed(moduleInfo){
      console.log('module',moduleInfo)

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

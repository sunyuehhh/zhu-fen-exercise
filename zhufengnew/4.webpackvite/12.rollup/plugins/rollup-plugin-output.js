function output(pluginOptions){
  return {
    name:'output',//插件得名字
    outputOptions(outputOptions){
      console.log(outputOptions)

      return outputOptions

    },
    async renderStart(outputOptions){
      outputOptions.dir='dist2'

      return outputOptions

    },
    async banner(){
      return '//banner'
    },
    async footer(){
      return '//footer'
    },
    async intro(){
      return '//intro'
    },
    async outro(){
      return '//outro'
    },
    // 此钩子是为数不多得同步钩子  不能加async
    renderDynamicImport(){
      return {
        left:"dynamicImportPolyfill(",
        right:",import.meta.url)"
      }
    },
    augmentChunkHash(chunkInfo){
      console.log(chunkInfo,'chunkInfo')
    },
    resolveId(source){//原义是获取source对应得绝对路径 直接返回
      if(source==='logger'){
        return source
      }

    },
    load(importee){
      if(importee==='logger'){
        // 发出一个包含再生成输入中得新文件 并返回一个referenceId
        // 该ID可再不同位置用于引用发出得文件
        const referenceId=this.emitFile({
          type:'asset',
          source:'console.log("LOGGER")',
          fileName:'logger.js'
        })

        return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`
      }

    },
    // 将import.meta替换成14
    resolveImportMeta(property){
      return 14
    },
    renderChunk(code,chunk,options){


    },
    generateBundle(options,bundle,isWrite){
      let entryNames=[];
      for(let fileName in bundle){
        let assetOrChunkInfo=bundle[fileName]
        if(assetOrChunkInfo.isEntry){
          entryNames.push(fileName)
        }
      }
      this.emitFile({
        type:'asset',
        fileName:'index.html',
        source:`
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
${entryNames.map(entryName=>`<script src="${entryName}" type="module" />`)}
  
</body>
</html>
        `
      })

    }

  }
}


export default output
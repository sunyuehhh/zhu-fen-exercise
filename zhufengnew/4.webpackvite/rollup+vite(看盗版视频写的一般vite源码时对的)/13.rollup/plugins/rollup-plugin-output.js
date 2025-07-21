function output(pluginOptions){
  return {
    name:'output',//插件的名字
    //  outputOptions(outputOptions){

    // },
    // async renderStart(outputOptions){
    //   // outputOptions.dir='dist2'

    // },
    // async banner(){
    //   return '//banner'
    // },
    // async footer(){
    //   return '//footer'
    // },
    // async intro(){
    //   return '//intro'
    // },
    // async outro(){
    //   return '//outro'
    // },
    renderDynamicImport(){
      return {
        left:'dynamicImportPolyfill(',
        right:",import.meta.url)"
      }
    },
    resolveId(source){//原义是获取source对应的绝对路径，直接返回
      if(source=='logger'){
        return source
      }

    },
    load(importee){
      if(importee=='logger'){
        // 发出一个包含在生成输出中的新文件，并返回一个referenceId,
        // 该ID可在不同位置用于引用发出的文件
        const referenceId=this.emitFile({
          type:'asset',
          source:'console.log("LOGGER")',
          filename:'logger.js'
        })
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`
      }
    },
    resolveFileUrl({chunkId,fileName}){
      return `new URL('${fileName}',document.baseURI).href`


    },
    resolveImportMeta(property){
      console.log('resolveImportMeta',property)
      return 14

    },
    generateBundle(options,bundle,isWrite){
      let entryName=[]
      for(let fileName in bundle){
        let assetOrChunkInfo=bundle[fileName]
        if(assetOrChunkInfo.isEntry){
          entryName.push(fileName)
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
  ${
    entryName.map(entry=>`<script src="${entry}" type="module"></script>`)
  }
</body>
</html>
        `
      })

    }

  }

}

export default output
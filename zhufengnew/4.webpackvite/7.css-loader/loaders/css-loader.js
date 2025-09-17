let loaderUtils=require('loader-utils')
let postcss=require('postcss')
let Tokenizer=require('css-selector-tokenizer')

function loader(inputSource){
  let loaderOptions=loaderUtils.getOptions(this)||{}
  let callback=this.async()
  const cssPlugin=(options)=>{
    return (root)=>{
      // 1.删除所有的@import 2.把导入的CSS文件路径添加到options.imports里
      root.walkAtRules(/^import$/i,(rule)=>{
        console.log(rule,'rule')
        rule.remove();//在CSS脚本里把这@import删除
        options.imports.push(rule.params.slice(1,-1));//./global.css

      })
      // 2.遍历语法树 找到里面所有的url
      root.walkDecls(decl=>{
        let values=Tokenizer.parseValues(decl.value)
        values.nodes.forEach(node=>{
          node.nodes.forEach(item=>{
            if(item.type==='url'){
              // stringifyRequest可以把任意路径标准化为相对路径
              let url=loaderUtils.stringifyRequest(this,item.url)
              console.log(url,'url')//"./images/kf.jpg"
              item.url="`+require("+url+")+`"
              // require会给webpack看和分析 webpack一看你引入了一张图片
              // webpack会使用file-loader去加载图片
            }
          })
        })
        let value=Tokenizer.stringifyValues(values)
        decl.value=value
      })


    }
  }

  // 将会用它来收集所有的@import 
  let options={imports:[]}
  let pipeline=postcss([cssPlugin(options)])


  pipeline.process(inputSource).then(result=>{
    let {importLoaders=0}=loaderOptions;//几个前置loader
    let {loaders,loaderIndex}=this;//所有的loader数据和当前loader的索引
    let loadersRequest=loaders.slice(
      loaderIndex,
      loaderIndex+importLoaders
    ).map(x=>x.request).join('!')


    let importCSS=options.imports.map(url=>`list.push(...require(`+loaderUtils.stringifyRequest(this,`-!${
      loadersRequest
    }!${url}`)+`));`).join('\r\n')

    let script=`
        var list=[]
        list.toString=function(){return this.join('')}
        ${importCSS}
        list.push(\`${result.css}\`)
        module.exports=list
    `
    callback(null,script)
  })


}

module.exports=loader
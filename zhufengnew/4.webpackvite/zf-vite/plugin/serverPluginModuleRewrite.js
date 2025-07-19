const {readBody} = require('./utils')
const {parse}=require('es-module-lexer')//解析import
const MagicString=require('magic-string')

function rewriteImports(source){
  console.log(source,'source')
  let imports=parse(source)[0]

  let magicString=new MagicString(source) //overwrite
  if(imports.length){
    // 说明有多条import 语法

    for(let i=0;i<imports.length;i++){
      let {s,e}=imports[i]
      let id=source.substring(s,e);//vue ./App
      // 当前开头的是 \或者 . 不需要重写
      if(/^[^\/\.]/.test(id)){
        id=`/@modules/${id}`
        magicString.overwrite(s,e,id)

      }
    }


  }

  return magicString.toString()


}


function moduleRewritePlugin({app,root}){//启动项目时的根节路径
  app.use(async (ctx,next)=>{

    await next();


    // 在这里完善了自己的逻辑  洋葱模型





    if(ctx.body && ctx.path.endsWith('.js')){
    // 读物流中的数据
    let content=await readBody(ctx.body)
    // 重写内容  将重写后的结果返回回去
    const result=rewriteImports(content)

    ctx.body=result;//将内容重写并返回

    }

  })
}



exports.moduleRewritePlugin=moduleRewritePlugin
const path=require('path')
const moduleREG=/^\/@modules\//
const fs=require('fs').promises


function resolveVue(root){
  // vue3由及部分组成   runtime-dom runtime-core reactivity shared  在后端中解析.vue文件 compiler-sfc

  // 编译时在后端实现的  所以我需要拿到的文件时commonjs规范
  const compilerPkgPath=path.join(root,'node_modules','@vue/compiler-sfc/package.json')

  const compilerPkg=require(compilerPkgPath)//获取的是json中的内容
  const compilerPath=path.join(path.dirname(compilerPkgPath),compilerPkg.main)



  const resolvePath=(name)=>path.resolve(root,'node_modules',`@vue/${name}/dist/${name}.esm-bundler.js`)


  const runtimeDomPath=resolvePath('runtime-dom')
  const runtimeCorePath=resolvePath('runtime-core')
  const reactivityPath=resolvePath('reactivity')
  const sharedPath=resolvePath('shared')


  // esModule模块


  return {
    compiler:compilerPath,//用于稍后后端进行编译的文件路径
    "@vue/runtime-dom":runtimeDomPath,
    "@vue/runtime-core":runtimeCorePath,
    "@vue/reactivity":reactivityPath,
    "@vue/shared":sharedPath,
    vue:runtimeDomPath
  }



}


function moduleResolvePlugin({app,root}){

  const vueResolved=resolveVue(root);//根据当前运行vite的目录解析出一个文件表来  包含vue中所有的模块

  app.use(async (ctx,next)=>{
    if(!moduleREG.test(ctx.path)){//处理当前请求的路径  是否以/@modules开头的
      return next()
    }

    // 将/@modules 替换掉   /@modules/vue

    const id=ctx.path.replace(moduleREG,'')   //vue


    // 应该去当前项目下查找   vue对应的真实的文件
    ctx.type="js";//设置响应类型   响应的结果是js类型
    // 应该去当前项目下查找  vue对应的真实的文件
    const content=await fs.readFile(vueResolved[id],'utf8')

    ctx.body=content;//返回读取的结果




  })





}


exports.moduleResolvePlugin=moduleResolvePlugin


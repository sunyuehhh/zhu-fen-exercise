const Koa=require('koa')
const {serveStaticPlugin}=require('./plugin/serverPluginServeStatic.js')
const {moduleRewritePlugin}=require('./plugin/serverPluginModuleRewrite.js')
const {moduleResolvePlugin}=require('./plugin/serverPluginModuleResolve.js')
const {htmlRewritePlugin}=require('./plugin/serverPluginHtml.js')
const {vuePlugin}=require('./plugin/serverPluginVue.js')
function createServer(){
  const app=new Koa();//创建一个koa实例
  const root=process.cwd()

  // 当用户运行   npm run my-dev时  会创建服务
  // koa是基于中间件来运行得
  const context={
    app,
    root  //当前的根的位置
  }


  console.log(context,'context')




  const resolvedPlugin=[//插件得集合
    vuePlugin,
    htmlRewritePlugin,
    // 2.解析import 重写路径
    moduleRewritePlugin,
    moduleResolvePlugin,

    // 1.要实现静态服务的功能
    serveStaticPlugin //功能是读取文件将文件的结果放在ctx.body上

  ]

  resolvedPlugin.forEach(plugin=>plugin(context))
  return app;//返回app 中listen方法

}


module.exports=createServer
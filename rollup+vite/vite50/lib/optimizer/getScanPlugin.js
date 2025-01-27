const fs=require('fs-extra');
const { normalizePath } = require("../utils");
const {createPluginContainer}=require('../server/pluginContainer');
const resolvePlugin=require('../plugins/resolve');
const htmlTypesRE=/\.html$/;
const scriptModuleRE=/<script\s+type="module"\s+src\="(.+?)">/;

/**
 * 获取esbuild扫描插件的工厂方法
 * @param {*} config  配置对象  root
 * @param {*} depImports   将用来存放导入的模块
 */
async function getScanPlugin(config,depImports){
  const resolve=async function (path,importer) {
    const container=await createPluginContainer({plugins:[resolvePlugin({root:config.root,resolve:{alias:{}}})],root:config.root})
    // 由插件容器进行路径解析，返回绝对路径
    return await container.resolveId(path,importer)
    
  }
  // rollup讲过如何写插件{resolveId(path,importer){}}
  // 没有讲整个插件是如何运行的，插件机制是如何实现的
  return {
    name:'vite:dep-scan',
    setup(build){
      // 入口文件index.html   找index.html它的真实路径
      build.onResolve({filter:htmlTypesRE},async ({path,importer})=>{
        // 把任意路径转为绝对路径   path可能是相对./index.html  绝对c:/index.html  也可能是第三方
        const resolved=await resolve(path,importer)
        // const resolved=path
        if(resolved){
          return {
            path:resolved.id||resolved,
            namespace:'html'
          }
        }
      })

      build.onResolve({filter:/.*/},async ({path,importer})=>{
        // 把任意路径转为绝对路径   path可能是相对./index.html  绝对c:/index.html  也可能是第三方
        const resolved=await resolve(path,importer)
        // const resolved=path
        if(resolved){
          const id=resolved.id||resolved;
          if(id.includes('node_modules')){
            depImports[path]=normalizePath(id)
            console.log(depImports,'depImportsdepImports')
            return {
              path:id,
              external:true,//表示这是一个外部模块，不需要进一步处理
            }
          }else{
          return {
            path:id,
          }
        }
        }
      })

      build.onLoad({filter:htmlTypesRE,namespace:'html'},({path})=>{
        // 需要将html转成JS才能进行后续处理
        const html=fs.readFileSync(path,'utf-8')
        let [,src]=html.match(scriptModuleRE)
        let jsContent=`import ${JSON.stringify(src)}`;//import /src/main.js

        return {
          contents:jsContent,
          loader:'js'
        }

      })

    }
  }
}


module.exports=getScanPlugin
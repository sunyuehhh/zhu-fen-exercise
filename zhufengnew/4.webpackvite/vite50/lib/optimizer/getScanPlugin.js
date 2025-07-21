const fs=require('fs-extra');
const { normalizePath } = require('../server/utils');
const {createPluginContainer}=require('../server/pluginContainer')
const resolvePlugin=require('../plugins/resolve')


const scriptModuleRE = /<script\s+type="module"\s+src="(.+?)">/;

const htmlTypesRE=/\.html$/;






/**
 * 获取esbuild扫描插件的工厂方法
 * @param {*} config 配置对象  root
 * @param {*} depImports 将用来存放导入的模块
 */
async function getScanPlugin(config,depImports){
  const container=await createPluginContainer({plugins:[resolvePlugin(config)],root:config.root})

  const resolve=async (path,importer)=>{
  // 由插件容器进行路径解析  返回绝对路径
    return await container.resolveId(path,importer)
  }
  return {
    name:'scan',//依赖扫描插件
    setup(build){

      // 如果遇到vue文件  则返回它的绝对路径  并且标识为外部依赖  不再进一步解析了
      build.onResolve({filter:/\.vue$/},async ({path:id,importer})=>{
        const resolved=await resolve(id,importer)
        if(resolved){
          return {
            path:resolved.id||resolved,
            external:true
          }
        }

      })








      // 入口文件是index.html  找index.html它的真实路径
      build.onResolve({filter:htmlTypesRE},async ({path,importer})=>{
        // const resolved=path
        const resolved=await resolve(path,importer)
        if(resolved){
          return {
            path:resolved.id||resolved,
            namespace:'html'
          }

        }


      })


      build.onResolve({filter:/.*/},async ({path,importer})=>{
        // const resolved=path
        const resolved=await resolve(path,importer)
        if(resolved){
          const id=resolved.id||resolved;//此模块的绝对路径

          console.log(id,'id')
          if(id.includes('node_modules')){
            depImports[path]=normalizePath(id);//key是包名 值是此包esmodule格式的入口文件的绝对路径

            return {
              path:id,
              external:true//表示这是一个外部模块  不需要进一步处理了
            }

          }else{
            return {
              path:id
            }
          }
        }
      })


      build.onLoad({filter:htmlTypesRE,namespace:'html'},({path})=>{
        // 需要把html转成JS才能进行后续的处理
        const html=fs.readFileSync(path,'utf8')
        let [,src]=html.match(scriptModuleRE)
        let jsContent=`import ${JSON.stringify(src)}`;//import "/src/main.js"

        return {
          contents:jsContent,
          loader:'js'
        }

      })


    }
  }

}


module.exports=getScanPlugin
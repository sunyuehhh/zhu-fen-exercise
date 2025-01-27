const {normalizePath}=require('./utils');
const path=require('path');
const {resolvePlugins}=require('./plugins')
const fs=require('fs-extra')
async function resolveConfig(params) {
  const root=normalizePath(process.cwd())
  const cacheDir=normalizePath(path.resolve('node_modules/.vite50'))
  let config={
    root,
    cacheDir,
  }
  // 读取用户自己设置的插件
  const configFile=path.resolve(root,'vite.config.js')
  const exists=await fs.pathExists(configFile)
  let userPlugins=[]
  if(exists){
    const userConfig= require(configFile)
    // 用户自定义配置覆盖默认配置
    userPlugins=userConfig.plugins||[]
    delete userConfig.plugins
    config={...config,...userConfig}
  }

    // 插件config方法执行
    for(let plugin of userPlugins||[]){
      if(plugin.config){
        let res=await plugin.config()
        if(res){
          config={...config,...res}
        }
      }
    }
  config.plugins=await resolvePlugins(config,userPlugins)

  return config
}


module.exports=resolveConfig
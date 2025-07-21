const {normalizePath}=require('./utils');
const path=require('path')
const {resolvePlugins}=require('../plugins')
const fs=require('fs-extra')


async function resolveConfig() {
  const root=normalizePath(process.cwd())
  const cacheDir=normalizePath(path.resolve(`node_modules/.vite50`))
  const config={
    root,
    cacheDir
  }


  // 读取用户自己设置的插件
  const configFile=path.resolve(root,'vite.config.js')
  const exists=await fs.pathExists(configFile)
  if(exists){
    const userConfig=require(configFile)
    // 用用户自定义配置项覆盖默认配置
    config={...config,...userConfig}
  }

  const userPlugins=config.plugins||[]

  config.plugins=await resolvePlugins(config,userPlugins)
  return config
}

module.exports=resolveConfig
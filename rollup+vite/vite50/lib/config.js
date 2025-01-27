const {normalizePath}=require('./utils');
const path=require('path');
const {resolvePlugins}=require('./plugins')
async function resolveConfig(params) {
  const root=normalizePath(process.cwd())
  const cacheDir=normalizePath(path.resolve('node_modules/.vite50'))
  const config={
    root,
    cacheDir,
  }
  config.plugins=await resolvePlugins(config)

  return config
}


module.exports=resolveConfig
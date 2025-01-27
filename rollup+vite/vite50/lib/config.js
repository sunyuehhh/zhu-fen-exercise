const {normalizePath}=require('./utils')
async function resolveConfig(params) {
  const root=normalizePath(process.cwd())

  const config={
    root
  }

  return config
}


module.exports=resolveConfig
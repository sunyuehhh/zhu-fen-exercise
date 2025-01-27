const resolvePlugin=require('./resolve')
const importAnalysis=require('./importAnalysis')
const preAliasPlugin=require('./preAlias.js')
const definePlugin=require('./define.js')
async function  resolvePlugins(config,userPlugins) {
  // 现在此处返回的是vite的内置插件
  return [
    preAliasPlugin(config),
    resolvePlugin(config),
    ...userPlugins,
    definePlugin(config),
    importAnalysis(config)
    
  ]
}


exports.resolvePlugins=resolvePlugins
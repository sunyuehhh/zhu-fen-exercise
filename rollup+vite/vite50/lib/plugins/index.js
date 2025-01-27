const resolvePlugin=require('./resolve')
const importAnalysis=require('./importAnalysis')
const preAliasPlugin=require('./preAlias.js')
async function  resolvePlugins(config) {
  // 现在此处返回的是vite的内置插件
  return [
    preAliasPlugin(config),
    resolvePlugin(config),
    importAnalysis(config)
  ]
}


exports.resolvePlugins=resolvePlugins
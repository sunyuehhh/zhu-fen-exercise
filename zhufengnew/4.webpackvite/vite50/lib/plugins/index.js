const resolvePlugin=require('./resolve')
const importAnalysisPlugin=require('./importAnalysis')
async function resolvePlugins(config,userPlugins) {
  // 现在此处返回的是vite的内置插件
  return [
    ...userPlugins,
    resolvePlugin(config),
    importAnalysisPlugin(config)
  ]
}

exports.resolvePlugins=resolvePlugins
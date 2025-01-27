const { build } = require('esbuild');
const scanImports=require('./scan');
const path=require('path');
const fs=require('fs-extra');
/**
 * 分析项目依赖的第三方依赖
 * @param {*} config 
 */
async function createOptimizeDepsRun(config){
  // deps   {vue: 'D:/vite50use/node_modules/vue/dist/vue.runtime.esm-bundler.js' }
const deps= await scanImports(config)
console.log(deps,'deps')
// node_modules/.vite50
const {cacheDir}=config
const depsCacheDir=path.resolve(cacheDir,'deps')
const metaDataPath=path.join(depsCacheDir,'_metadata.json')
const metadata={
  optimized:{}
}

for(const id in deps){
  const entry=deps[id];
  // 内存里存的是绝对路径  写入硬盘的是相对路径
  const file=path.resolve(depsCacheDir,id+'.js')
  metadata.optimized[id]={
    // C:/vite50use/node_modules/vue/dist/vue.runtime.esm-bundler.js
    src:entry,
    // C:\vite50use\node_modules\.vite\deps\vue.js
    file
  }

  await build({
    absWorkingDir:process.cwd(),
    entryPoints:[deps[id]],
    outfile:file,//打包后写入的路径
    bundle:true,
    write:true,
    format:'esm'
  })


}

fs.ensureDir(depsCacheDir);
await fs.writeFile(metaDataPath,JSON.stringify(metadata))

return {metadata}
}

exports.createOptimizeDepsRun=createOptimizeDepsRun
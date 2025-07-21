const scanImports=require('./scan')
const path=require('path')
const {build}=require('esbuild')
const fs=require('fs-extra')
const { normalizePath } = require('../server/utils')
/**
 * 分析项目依赖的第三方模块
 * @param {*} config 
 */
async function createOptimizeDepsRun(config){
  // D:/xuexishipin/exercise/zhu-fen-exercise/zhufengnew/4.webpackvite/vite50use/node_modules/vue/dist/vue.runtime.esm-bundler.js
  const deps=await scanImports(config)
  // cacheDir =node_modules\.vite50
  const {cacheDir}=config
  // depsCacheDir = node_modules\.vite50/deps
  const depsCacheDir=path.resolve(cacheDir,'deps')
  const metaDataPath=path.join(depsCacheDir,'_metadata.json')

  const metadata={
    optimized:{

    }
  }

  for(const id in deps){
    const entry=deps[id];
    // 内存里存的绝对路径 写入硬盘是相对路径
    const file=path.resolve(depsCacheDir,id+'.js')

    metadata.optimized[id]={
      // node_modules/vue/dist/vue.runtime.esm-builder.js
      src:entry,
      // node_modules\.vite\deps\vue.js
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

  await fs.ensureDir(depsCacheDir)
  await fs.writeFile(metaDataPath,JSON.stringify(metadata,(key,value)=>{
    if(key==='file'||key==='src'){
      return normalizePath(path.relative(depsCacheDir,value))

    }

    return value

  }))


  return {
    metadata
  }

}


exports.createOptimizeDepsRun=createOptimizeDepsRun
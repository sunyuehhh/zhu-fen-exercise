const {build}=require('esbuild');
const path=require('path');
const getScanPlugin=require('./getScanPlugin');

/**
 * 扫描项目中导入第三方模块
 * @param {*} config 
 */
async function scanImports(config){
  // 此处存放依赖导入
  const depImports={}
  // 创建一个esbuild的扫描插件
  const scanPlugin=await getScanPlugin(config,depImports)
  await build({
    absWorkingDir:config.root,//当前的工作目录
    entryPoints:[path.resolve('./index.html')],//指定编译的入口
    bundle:true,
    format:'esm',
    outfile:'./dist/bundle.js',
    // write:true,//在真实的代码write=false 不需要写入硬盘
    write:false,
    plugins:[scanPlugin]
  })


  return depImports

}



module.exports=scanImports
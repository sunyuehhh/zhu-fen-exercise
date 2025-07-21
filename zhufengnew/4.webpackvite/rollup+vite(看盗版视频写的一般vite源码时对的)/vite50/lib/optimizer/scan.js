const {build}=require('esbuild');
const getScanPlugin=require('./getScanPlugin');
const path=require('path');
/**
 * 扫描项目中导入的第三方模块
 * @param {*} config 
 */
async function scanImports(config){
  // 存放依赖导入
  const depImports={};
  const scanPlugin=await getScanPlugin(config,depImports);
  await build({
    absWorkingDir:config.root,//当前的工作目录
    entryPoints:[path.resolve('./index.html')],//指定编译的入口
    bundle:true,
    format:'esm',
    outfile:'./dist/bundle.js',
    write:true,//在真实的代码中write=false,不需要写入硬盘
    plugins:[scanPlugin]
  })
  return depImports
}





module.exports=scanImports
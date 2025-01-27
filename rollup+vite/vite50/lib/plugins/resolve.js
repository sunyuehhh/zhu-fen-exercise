const pathLib=require('path');
const resolve=require('resolve');
const fs=require('fs-extra');
//即是一个vite插件，也是一个rollup插件
function resolvePlugin({root,resolve={alias:{}}}){
  return {
    name:'resolve',
    // path   绝对  相对  第三方
    resolveId(path,importer){
      if(path.startsWith('/')){//如果path以/开头，说明它是一个根目录下的绝对路径
        return {id:pathLib.resolve(root,path.slice(1))}
        // 如果path是绝对路径
      }
      // fs.pathExistsSync(path)
      if(pathLib.isAbsolute(path)){
        return {id:path}

      }
        if(path.startsWith('.')){
      const basedir=pathLib.dirname(importer)
      const fsPath=pathLib.resolve(basedir,path)
      return {
      id:fsPath
    }
      }
      if(path.startsWith('@')){
        const basedir=alias['@']
        const fsPath=pathLib.resolve(basedir,path)
        return {
        id:fsPath
      }
      }

          // 如果是第三方的话
    let res=tryNodeResolve(path,importer,root);
    if(res) return res;


    }
  }

}

function tryNodeResolve(path,importer,root){
  const pkgPath=resolve.sync(`${path}/package.json`,{basedir:root})
  const pkgDir=pathLib.dirname(pkgPath)
  const pkg=JSON.parse(fs.readFileSync(pkgPath,'utf8'));
  const entryPoint=pkg.module;//module字段指向的是esmodule格式的入口
  const entryPointPath=pathLib.join(pkgDir,entryPoint)
  // C:\vite50use\node_modules\vue\dist\vue.runtime.esm-bundler.js
  return {
    id:entryPointPath
  }




}


module.exports=resolvePlugin
const pathLib=require('path')

const resolve=require('resolve')
const fs=require('fs-extra')
function resolvePlugin({root,resolve}){
  const alias=resolve?.alias

  return {
    name:'resolve',
    // path绝对 相对  第三方
    resolveId(path,importer){
      // 如果是path是一个绝对路径
      if(pathLib.isAbsolute(path)&&fs.pathExistsSync(path)){
        return {
          id:path
        }
      }
      //  /src/main.js
      if(path.startsWith('/')){//如果path是以/开头 说明它是一个根目录下的绝对路径
        return {
          id:pathLib.resolve(root,path.slice(1))
        }

      }


      // 如果是相对路径
      if(path.startsWith('.')){
        const baseDir=importer?pathLib.dirname(importer):root;
        const fsPath=pathLib.resolve(baseDir,path);
        return {
          id:fsPath
        }
      }

      if(path.startsWith('@')){
        const baseDir=alias['@']
        const fsPath=pathLib.resolve(baseDir,path)
        return {
          id:fsPath
        }
      }

      // 如果是第三方的话
      let res=tryNodeResolve(path,importer,root)
      if(res) return res

    }
  }

}

function tryNodeResolve(path,importer,root){
  console.log(path,importer,root,'********')
  // vue/package.json
  const pkgPath=resolve.sync(`${path}/package.json`,{
    basedir:root
  })

  const pkgDir=pathLib.dirname(pkgPath)
  const pkg=JSON.parse(fs.readFileSync(pkgPath,'utf8'))
  const entryPoint=pkg.module;//module字段指的是es module格式的入口
  const entryPointPath=pathLib.join(pkgDir,entryPoint)
  return {
    id:entryPointPath
  }

}



module.exports=resolvePlugin
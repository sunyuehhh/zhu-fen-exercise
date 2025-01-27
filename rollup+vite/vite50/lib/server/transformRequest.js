const fs=require('fs-extra')
const {parse}=require('url');
async function transformRequest(url,server) {
  // resolveId
  const { pluginContainer }=server
  // 此处其实是调用\lib\plugins\resolve.js 里的resolveId方法返回绝对路径
  // id  /src/main.js
  const {id}=await pluginContainer.resolveId(url)

  // load
  const loadResult=await pluginContainer.load(id)
  // 如果容器的load方法返回结果，就用返回的结果,否则就读硬盘上的文件
  let code;
  if(loadResult){
    code=loadResult.code
  }else{
    let fsPath=parse(id).pathname;
    code=await fs.readFileSync(fsPath,'utf-8')
  }


  // transform
  const result=await pluginContainer.transform(code,id)

  // debugger

  return result


}

module.exports=transformRequest
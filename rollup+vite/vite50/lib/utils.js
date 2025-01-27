function normalizePath(path){
  // 保证所有路径分隔符全部是/，而非\
  console.log(path,'path')
  return path?path?.replace(/\\/g,'/'):path


}

const knowJSSrcRE=/\.js/
function isJSRequest(url){
  return knowJSSrcRE.test(url)
}


exports.isJSRequest=isJSRequest

exports.normalizePath=normalizePath
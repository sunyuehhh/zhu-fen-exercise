const {parse}=require("url")
const {isJSRequest}=require('../utils')
const send =require('../send')
const transformRequest=require('../transformRequest')
function transformMiddleware(server){
  return async function (req,res,next) {
        console.log(req.url,'url')
    if (req.url === '/.well-known/appspecific/com.chrome.devtools.json') {
    res.statusCode = 204 // 或 404 / 200
    res.end()
    return
    }
    if(req.method!=='GET') return next();

    // 获取路径名  /src/main.js?id=1 pathname=/src/main.js  query={id:1}
    let pathname=parse(req.url).pathname
    debugger
    // 如果请求的资源是JS的话  重写第三方模块的路径
    if(isJSRequest(pathname)){
      const result=await transformRequest(req.url,server)
      if(result){
        return send(req,res,result.code,'js')
      }else{
        return next()
      }
    }else{
      return next()
    }
    
  }

}



module.exports=transformMiddleware
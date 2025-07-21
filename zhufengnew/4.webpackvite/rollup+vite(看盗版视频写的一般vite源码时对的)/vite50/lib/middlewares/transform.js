const {parse}=require('url');
const {isJSRequest}=require('../utils')
const send=require('../server/send');
const transformRequest=require('../server/transformRequest')
function transformMiddleware(server){
  return async function (req,res,next) {
    if(req.method!=='GET') return next();
    // 获取路径名称
    // 获取路径名  src/main.js?id=1  pathname=/src/main.js  query={id:1}
    let pathname=parse(req.url).pathname;
    if(isJSRequest(req.url)){
      // 如果请求的资源是js的话  需要重写第三方导入路径
      // 此处传的一定是req.url  如果只传pathname 会丢失query
      // 而我们后面会写vue插件   会依赖查询参数
      const result=await transformRequest(req.url,server)
      console.log(result,'result')
      if(result){
        console.log(send,result.code,'send')
        return send(req,res,result.code,'js')
        // return next();
      }else{
        return next()
      }

    }else{
      return next()
    }    
  }

}

module.exports=transformMiddleware
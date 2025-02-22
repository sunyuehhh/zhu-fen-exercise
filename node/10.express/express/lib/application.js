const http=require('http')
const Router=require('./router/index')


// 创建一个路由系统  维护用户定义的路由配置



// 我们要给每个应用配置一个路由系统 路由系统每个应用只有一个
function Application(){

  this._router=new Router()

}

Application.prototype.get=function (path,...handlers){
  this._router.get(path,handlers)

}

Application.prototype.listen=function (...args){
  const server=http.createServer((req,res)=>{
    function done(){
      res.end(`Cannot ${req.method} ${req.url}`)
    }

    this._router.handle(req,res,done)
  })

  server.listen(...args)


}



module.exports=Application
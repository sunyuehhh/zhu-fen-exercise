// let app=express()  let app=new Koa()
// 再express里有静态文件中间件得概念
module.exports=(app)=>{
  // controller={news:new NewsController()}
  // 1.从app中解构路由和控制器  new Router
    const {router,controller}=app
    // 定义一个路由规则  当客户端通过get方式访问/news得时候，会由index函数来返回内容
  router.get('/news',controller.news.index)
}
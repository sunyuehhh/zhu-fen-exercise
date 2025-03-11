// cookie session  加密cookie  服务器把cookie发送给客户端之后  为了放置客户端篡改数据  设置密码
// exports.keys='zhufeng'

// 中间件和插件得区别是什么？
// 中间件什么时候用得？是再请求到来得时候  再真正得处理之前执行的一段逻辑
// 插件  是扩展了egg.js的一些功能，比如能让egg.js渲染nunjucks模板
module.exports=app=>{
  let config={}
  // 配置加密得key  用来加密cookie
  config.keys=app.name+(+new Date());
  // config.key='zhufeng'
  // 配置视图  view
  config.view={
    // 默认的扩展名  当你渲染一个文件 但是没有指定扩展名，而且又找不到这个文件，就会尝试添加这个扩展名查找
    defaultExtension:'.html',
    // 如果某个扩展名的模板文件再mapping里配置  那么就会用这个默认的模板引擎来进行渲染
    defaultViewEngine:'nunjucks',
    // 如果要渲染得模板是以.html结尾得话，就会用nunjucks模板引擎来进行渲染
    mapping:{
      '.html':'nunjucks',
      '.ejs':'ejs'
    }
  }

  config.news={
    url:'http://localhost:3000/news'
  }

  config.cache={
    url:'http://localhost:3000/cache'
  }

  // config.mysql={
  //   client:{
  //     host:'127.0.0.1',
  //     user:'root',
  //     password:'Wm@130835',
  //     port:3306,
  //     database:'cms-development'
  //   },
  //   app:true,//要把mysql模块挂载再app对象上  app.mysql
  // }

  return config
}

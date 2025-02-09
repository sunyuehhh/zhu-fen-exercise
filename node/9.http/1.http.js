const http=require('http');
const url=require('url')


// 请求方法     restful风格 根据我们的请求方法来决定绝对资源的操作
//    get 获取   post  增加  put 修改  delete  删除

// options  试探请求  跨域的时候出现  预检请求
// 简单请求不会发送预检请求   (get,pots就是简单请求   如果增加了自定义的header 此时就会编程复杂请求)





// node中的主线程是单线程的  请求来了后会进行处理  后面的请求要等待钱买你处理完毕后 才能处理
// req代表客户端的请求  （请求相关信息）
// res代表的是服务端的响应
const server=http.createServer((req,res)=>{
  // 解析请求参数  http 模块基于net模块的   它会增加header来进行处理

  // http模块是基于net模块的，会将接收到的客户信息  存储到req中
  console.log(req.method);//方法名字都是大写

  // 路径  http://username:password@host/pathname?query#hash
  const {pathname,query}=url.parse(req.url,true)
  console.log(pathname,query)
  console.log(req.url)
  console.log(req.httpVersion);



  // 请求行  GET /xxx   http/1.1

  // 请求头
  console.log(req.headers);//node  中将header的key 全部转换成小写



  if(pathname==='/sum'){//再node中 这种代码可以通过子进程转换成进程间通信来处理  不应该放在主线程中  会阻塞代码
    



  }else{

  // 请求体
  const arr=[]
  req.on('data',function(chunk){ //如果有请求体则会进入on('data')  this.push()
    arr.push(chunk)

  })

  req.on('end',function(){//this.push(null)
    console.log(Buffer.concat(arr).toString(),'end')

  })


  // 响应也分为这几个部分
  // 相应行
  // 状态码由服务端来设置  可以随意设置  但是一般都是按浏览器规范设置
  // 状态码
  // 1：  101  websocket  协议升级 升级为websocket
  // 2    200  成功  204:成功了但是没有响应体   206:分段传输 (拿到内容的部分数据)
  // 3    301  永久重定向(比如访问一个网址  被永远重定向 不会回来了)   302  临时重定向(如何记忆  三心二意)   304  缓存相关  协商缓存
  // 4    400   参数传递有问题  401  没登陆    403  登录了没权限   404 找不到  405方法不允许
  // 5    500  服务端错误   

  // favicon.ico  每个都有一个这样的图标(我们控制不了这个请求,自动发送的)

  res.statusCode=200;
  res.setHeader('Content-Type','text/plain;charset=utf-8')

  res.end('中文')
  // 响应头
  // 相应体
  }

})

let port=process.env.PORT|| 4000

server.listen(port,function(){
  console.log('server start'+port)
})

server.on('error',function(err){
  console.log(err,'---------')
  if(err.code=='EADDRINUSE'){//端口被占用
    server.listen(++port)
  }

})
// 每个系统又对应的设置环境变量的方式  cross-env  来设置启动的端口  通过环境变量的方式






// 本地开发  一般采用nodemon   node的监视器 监视文件变化
// 上线的时候  我们采用pm2
// 文件保存后可以自动重启
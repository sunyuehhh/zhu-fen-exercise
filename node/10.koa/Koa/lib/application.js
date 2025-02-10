const http = require("http");
const request = require("./request");
const response = require("./response");
const context=require('./context')
const compose=require('./koa-compose');
const { Stream } = require("stream");
class Application {
  constructor() {
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.context=Object.create(context)
    this.middleware=[]
  }
  // 使用一个请求处理函数
  use(fn) {
    // 先把这个fn暂存起来 等待以后请求到来的时候进行调用
    this.middleware.push(fn)
    return this
  }
  listen(...args) {
    // 创建一个http服务器
    const server = http.createServer(this.callback());
    // 把端口号和成功后的回调
    server.listen(...args);
  }
  callback = () => {
    // 把中间件的函数数组组成一个函数
    const fn=compose(this.middleware)
    // http createServer参数
    const handleRequest = (req, res) => {
      // 创建一个新的context对象 此对象里保存着原生的请求和响应对象
      const ctx = this.createContext(req, res);
      // this.middleware(ctx);
      // //   取出ctx.body,并且真正写入响应体
      // return res.end(ctx.response.body);
      return this.handleRequest(ctx,fn)
    };
    return handleRequest;
  };

  handleRequest(ctx,fnMiddleware){
    const handleResponse=()=>respond(ctx)
    const onerror=(error)=>ctx.onerror(error)
    return fnMiddleware(ctx).then(handleResponse).catch(onerror)

  }

  createContext(req, res) {
    const context = Object.create(this.context)
    // 需要保证每次请求带来的时候  每个context都是新的  context里每个request和response也是新的
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    //让封装后的request的req属性执行原始的Nodejs请求对象
    request.req = context.req = req;
    //让封装后的response的res属性指向原始的Node.js的响应对象
    response.res = context.res = res;
    return context;
  }
}
function respond(ctx){
  const {res,body}=ctx
  // 把响应内容写入响应流，并关闭相应流
  // 因为body类型现在支持各种类型
  if(Buffer.isBuffer(body)) return res.end(body);
  if(typeof body=='string') return res.end(body);
  // 如果响应体是流的格式  那么可以以管道的方式将可读流写入相应流
  if(body instanceof Stream) return body.pipe(res);
  // 原生的end只能接收字符串 buffer
  res.end(JSON.stringify(body))

}
module.exports = Application;
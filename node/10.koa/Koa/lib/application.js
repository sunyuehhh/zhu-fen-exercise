const http = require("http");
const request = require("./request");
const response = require("./response");
const context=require('./context')
class Application {
  constructor() {
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.context=Object.create(context)
  }
  // 使用一个请求处理函数
  use(fn) {
    // 先把这个fn暂存起来 等待以后请求到来的时候进行调用
    this.middleware = fn;
  }
  listen(...args) {
    // 创建一个http服务器
    const server = http.createServer(this.callback());
    // 把端口号和成功后的回调
    server.listen(...args);
  }

  callback = () => {
    // http createServer参数
    const handleRequest = (req, res) => {
      // 创建一个新的context对象 此对象里保存着原生的请求和响应对象
      const ctx = this.createContext(req, res);
      this.middleware(ctx);
      //   取出ctx.body,并且真正写入响应体
      return res.end(ctx.response.body);
    };

    return handleRequest;
  };

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

module.exports = Application;
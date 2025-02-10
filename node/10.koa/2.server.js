const koa = require("./koa");
const app = new koa();
app.use(function (ctx) {
  console.log(ctx.method);
  //   请求URL地址  http:/localhost/a/b?id=1#top
  //   /a/b?id=1
  console.log(ctx.url);
  //   请求的地址  /a/b  不包含查询字符串和锚点
  console.log(ctx.path);

  console.log(ctx.query); //查询字符串

  console.log(ctx.header);

  //   响应状态码200
  ctx.status = 200;
  //   响应的状态码的原因短语
  ctx.message = "OK";

  //设置响应头  中的内容类型为html  编码为utf8
  // ctx.response.set("Content-Type", "text/html;charset=utf-8");
  ctx.set("Content-Type", "text/html;charset=utf-8");

  //   设置响应体
  ctx.body = "hello";
  ctx.body = "world";
  ctx.body = "third";

  //   ctx.res.end();
});
app.listen(5000, () => {
  console.log(`server is running at http://locahost:5000`);
});
const koa = require("./koa");
const path=require('path')
const static=require('./koa-static')

const app = new koa();

// 使用一个静态文件中间件，此中间件以static目录为静态文件根目录
app.use(static(path.join(__dirname,'static')))


app.listen(5000, () => {
  console.log(`server is running at http://locahost:5000`);
});
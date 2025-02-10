const koa = require("./Koa");
const app = new koa();
const fs=require('fs')


const middleware=async (ctx,next)=>{
  ctx.body='hello'//字符串
  ctx.body=Buffer.from('buffer')//是一个二进制的Buffer对象
  ctx.body=fs.createReadStream('./package.json')//是一个可读流
  ctx.body={
    name:'hello'
  }//还可以是一个普通的JS对象
}

app.use(middleware)
app.listen(5000, () => {
  console.log(`server is running at http://locahost:5000`);
});
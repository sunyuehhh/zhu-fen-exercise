const koa = require("./Koa");
const app = new koa();


const middleware1= async (ctx,next)=>{
  throw new Error('middleware1 error')
  console.time('cost')
  console.log(1)
  await next()
  console.log(2)
  console.timeEnd('cost')

}

const middleware2=async (ctx,next)=>{
  console.log(3)
  await new Promise((resolve)=>{
    setTimeout(()=>{
      console.log(`middleware2 sleep2 1s`)
      resolve()
    },1000)

  })
  await next()
  console.log(4)

}

const middleware3=async (ctx)=>{
  console.log(5)
  await new Promise((resolve)=>{
    setTimeout(()=>{
      console.log(`middleware2 sleep3 1s`)
      resolve()
    },1000)

  })
  console.log(6)
  ctx.body='hello'

}

app.use(middleware1)
app.use(middleware2)
app.use(middleware3)


app.listen(5000, () => {
  console.log(`server is running at http://locahost:5000`);
});
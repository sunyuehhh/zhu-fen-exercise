const koa = require("./Koa");
const app = new koa();


const middleware1=(ctx,next)=>{
  console.log(1)
  next()
  console.log(2)

}

const middleware2=(ctx,next)=>{
  console.log(3)
  next()
  console.log(4)

}

const middleware3=(ctx)=>{
  console.log(5)

}

app.use(middleware1)
app.use(middleware2)
app.use(middleware3)


app.listen(5000, () => {
  console.log(`server is running at http://locahost:5000`);
});
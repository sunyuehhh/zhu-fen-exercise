const express=require('./express')
const app=express()

app.get('/',function(req,res,next){
  // 放访问路由的时候   可能做一些权限处理  请求的格式化  鉴权
  console.log(1)
  next()//next执行后返回的不是一个promise  不会出现第一个需要等待第二个的情况

},
function(req,res,next){
  console.log(2)
  next()
},
function(req,res,next){
  console.log(3)
  next()
})

app.get("/",function(req,res,next){
  res.end('end')

})




app.listen(3000,function(){
  console.log('server start 3000')
})
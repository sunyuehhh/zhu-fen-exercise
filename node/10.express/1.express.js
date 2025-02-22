const express=require('./express')
const app=express()

app.get('/',function(req,res){
  console.log(req.url,req.method)

  res.end('home')


})

app.get('/other',function(req,res){
  console.log(req.url,req.method)

  res.end('other')


})



app.listen(3000,function(){
  console.log('server start 3000')
})
const express=require('express')
const app=express()



app.get('/',function(req,res){
  res.end('get home')
})


app.post("/",function(){
  res.end("post home")
})
app.listen(3000,function(){
  console.log('server start 3000')
})
let express=require('express')

let app=express()

app.get('/api/user',(req,res)=>{
  res.json({
    name:'珠峰架构'
  })

})

app.listen(3000)
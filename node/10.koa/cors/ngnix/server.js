const express=require('express')
const app=express()
app.use(express.static('public'))
app.use('/api/user',(req,res)=>{
  res.json([{id:1}])

})
const port=3000
app.listen(port,()=>console.log(port))
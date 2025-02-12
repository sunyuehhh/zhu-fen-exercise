const express=request('express')
const app=express()

app.set('/sugrec',(req,res)=>{
  const {wd,cb}=req.query;
  res.send(`${cb}({
    g:[1]
    })`)

})

app.listen(3000,()=>{
  console.log(3000)
})
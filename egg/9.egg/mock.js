let express=require('express')
let app=express();

let Mock=require('mockjs')


app.get('/news',function(req,res){

  let result=Mock.mock({
    "code":0,
    "message":"成功",
    [`data|${req.query.limit||5}`]:[{
      "id":"@id",
      "ip":"@ip",
      "name":"@cname",
      "userId":"@id",
      "stars|2":["*"],
      "avatar":"@image()",
      "createAt":"@datetime",
    }]
  })

  res.json(result)

  

})
app.listen(3000)
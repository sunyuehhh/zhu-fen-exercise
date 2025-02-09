const fs=require('fs')
const path=require('path')

const rs=fs.createReadStream(path.resolve(__dirname,'test.md'),{
  highWaterMark:4
})

const ws=fs.createWriteStream(path.resolve(__dirname,'copy.md'),{
  highWaterMark:2
})


rs.on('data',function(data){
  let flag=ws.write(data)
  if(!flag){
    rs.pause()
  }

})

rs.on('end',function(){
  ws.end()
})

ws.on('drain',function(){
  rs.resume()
})
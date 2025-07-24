const readableStream=require('./readableStream')
readableStream.on('data',(data)=>{
  console.log(data.toString())

})
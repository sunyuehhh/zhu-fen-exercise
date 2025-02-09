const fs=require('fs')
const path=require('path')

const ReadStream=require('./ReadStream')

const rs=new ReadStream(path.resolve(__dirname,'test.md'),{
  flags:'r',//fs.open(flags)
  encoding:null,//标识读取的编码就是Buffer格式
  mode:0o666,
  autoClose:true,//关闭文件
  emitClose:true,//出发关闭事件
  start:0,
  end:4,//我要读取索引从0开始到索引微5的位置
  highWaterMark:3,//控制读取的速度   默认是64k

})


rs.on('open',function(fd){
  console.log(fd,'fd')
})
const arr=[]
rs.on('data',function(chunk){//可以监听data事件会让非流动模式变为流动模式
  arr.push(chunk)

})

rs.on('end',function(){
  console.log(Buffer.concat(arr).toString())
})


// rs.on('close',function(){
//   console.log('close')

// })

rs.on('error',function(){
  console.log('error')
})


// setInterval(()=>{
//   rs.resume()
// },1000)



// open和close 是针对文件来说的   方法不输于可读流
// 可读流都拥有on('data')  on('end')
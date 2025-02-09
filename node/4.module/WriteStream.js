const fs=require('fs')
const path=require('path')
const createWriteStream=require('./WriteStreamYuanma')

const ws=new createWriteStream(path.resolve(__dirname,'test.md'),{
  flags:'w',
  node:0o666,
  autoClose:true,
  emitClose:true,
  start:0,
  highWaterMark:3
})


let idx=0;
function write(){
  if(idx<10){
    let flag=ws.write(idx++ +'');
    if(flag){
      write()
    }
  }
}


write()

ws.on('drain',function(){
  console.log('抽干')
  write()
})
// const Writable = require('./Writable')
const Writable = require('stream')

const ws=new Writable({
  highWaterMark:1,//最高水位线  其实就是指的能缓存的数据大小
  write(data,encoding,next){
    console.log(data.toString())
    setTimeout(next,1000)

  }
})

// 如果缓存区满了  那就返回false  如果没有满  那就返回true
let writted=ws.write('1')
console.log('writted:1',writted)


// 监听  可写流的排干事件
ws.once('drain',()=>{

})
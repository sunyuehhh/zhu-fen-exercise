// Buffer是用来存放内容的  表示的是内存空间
// 1.buffer声明方式需要指定大小
// 长度  指定BUffer中存放的特定内容  我们可以直接给字符串
console.log(Buffer.alloc(3))//node中的最小单位都是字节
console.log(Buffer.from([100,200]))//这种方式不常用
console.log(Buffer.from('帅'))


// Buffer.alloc()  分配大小
// Buffer.from()  将内容转换成buffer
// Buffer.copy()
// Buffer.concat() 拼接
// Buffer.slice()  截取内存  浅拷贝
// toString()  转换成字符串
// buffer.length  是字节长度
// Buffer.isBuffer()
// split  基于之前的方法封装

// 表单传输数据  enctype="multipart/form-data"

const fs=require('fs')
const path=require('path')

Buffer.prototype.split=function(sep){
  sep=Buffer.isBuffer(sep)?sep:Buffer.from(sep)

  console.log(this.indexOf(sep),'this')

  let r=[]
  let idx=0;
  let offset=0
  while(-1!==(idx=this.indexOf(sep,offset))){
    r.push(this.slice(offset,idx))
    offset=idx+sep.length

  }
  r.push(this.slice(offset))
  return r

}

fs.readFile(path.resolve(__dirname,'note.md'),function(err,data){
  const res=data.split('\n')
  console.log(res,'res')

})
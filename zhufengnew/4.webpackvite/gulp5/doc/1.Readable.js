const {Readable}=require('stream')
const util=require('util')

function GlobStream(){
  Readable.call(this,{
    objectMode:true
  })
}

util.inherits(GlobStream,Readable)

const files=['file1','file2','file3']
let idx=0
// _read方法用来从数据源中读取数据
GlobStream.prototype._read=function(){
  if(idx<files.length){
    // 从水井里抽水  注入水箱  也就是可读流的缓存区
    this.push(files[idx++])
  }else{
    // 放置null就表示读取结果
    this.push(null)
  }
}

let gs=new GlobStream()

gs.on('data',(data)=>{
  console.log(data)

})
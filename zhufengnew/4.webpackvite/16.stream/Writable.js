const Stream=require('stream')
const {inherits}=require('util')
function Writable(options){
  Stream.call(this,options)
  this._writableState={
    ended:false,//是否已经写完了 是否已经把所有馒头吃完了 吃撑了 吃不下了
    writing:false,//是否正在写 是否嘴里正在吃馒头
    buffer:[], //缓存区 用来存放将要写入的数据  也就是放馒头的桌子
    bufferSize:0  //正在处理中的数据字节数等正在吃的和桌子上放的  也就是正在向底层系统写入的+缓存区里的
  }

}


inherits(Writable,Stream)

Writable.prototype.write=function(chunk){
  if(this._writableState.ended){
    return false
  }
  chunk=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk)
  // 不管你的数据是放在缓存区里  还是直接写入底层文件系统
  this._writableState.bufferSize+=chunk.length
  let writted=this.options.highWaterMark>this._writableState.bufferSize
  // 如果当前正在写入2
  if(this._writableState.writing){
    this._writableState.buffer.push(chunk)
  }else{
    // 如果当前没有正在写入1
    // _write是真正的写入方法  比如说写入硬盘 吃馒头
    this._writableState.writing=true
    this._write(chunk,'utf8',()=>{
      this._writableState.bufferSize-=chunk.length
      this.next()
    })
  }

  return writted

}


Writable.prototype.next=function(){
  this._writableState.writing=false
  if(this._writableState.buffer.length>0){
    let chunk=this._writableState.buffer.shift()
    this._write(chunk,'utf8',()=>{
      this._writableState.bufferSize-=chunk.length
      this.next()
    })
  }else{
    this.emit('drain')
  }
}

Writable.prototype.end=function(){
  this._writableState.ended=true
  
}


module.exports=Writable
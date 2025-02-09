const fs=require('fs')
const EventEmitter=require('events')

class WriteStream extends EventEmitter{
  constructor(path,options){
    super()
    this.path=path
    this.flags=options.flags||'w'
    this.autoClose=options.autoClose||true
    this.emitClose=options.emitClose||true
    this.start=options.start||0
    this.highWaterMark=options.highWaterMark||16*1024

    this.cache=[];//这里除了第一次写入之后，都会将写入操作放置队列中
    this.writing=false;//默认情况  没有调用过write
    this.needDrain=false;//只有当写入的个数，达到highWaterMark并且被清空后才会触发drain事件
    this.len=0;//默认同于记录写入的个数

    this.offset=this.start;//记录写入的位置

    this.open()

  }

  destroy(err){
    if(err) return this.emit('error',err)
  }

  open(){
    fs.open(this.path,this.flags,(err,fd)=>{
      if(err) return this.destroy(err)
        this.fd=fd
      this.emit('open',fd)

    })
  }

  clearBuffer(){
    let cacheObj=this.cache.shift()
    if(cacheObj){
      this._write(cacheObj.chunk,cacheObj.encoding,cacheObj.callback)
    }else{
      this.writing=false
      if(this.needDrain){
        this.needDrain=false
        this.emit('drain')//等待内存中没有值了，则触发drain事件
      }
    }


  }

  // 此write方法是用户调用的  并不是真正的写入方法
  write(chunk,encoding='utf8',callback=()=>{}){
    chunk=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk)
    this.len+=chunk.length

    // 写入的个数超过预期了，不要再给了
    let res=this.len>=this.highWaterMark
    this.needDrain=res;//只有达到预期  最后都写入完毕后，看此值是否为true,触发drain事件

    if(!this.writing){
      // 需要将本次内容写入到文件中
      this.writing=true
      this._write(chunk,encoding,()=>{
        callback()
        this.clearBuffer()
      });//真正向文件中写入
    }else{
      // 放入到队列中
      this.cache.push({
        chunk,
        encoding,
        callback
        
      })

      console.log(this.cache,'this.cache')


    }
    return !res
  }

  _write(chunk,encoding,callback){
    if(typeof this.fd!=='number'){
      return this.once('open',()=>this._write(chunk,encoding,callback))
    }

    fs.write(this.fd,chunk,0,chunk.length,this.offset,function(err,written){
      this.offset+=written;//写入后增加偏移量
      this.len-=written   //第一次写文件   第二次  第三次放入缓存中
      callback()



    })

  }
}



module.exports=WriteStream
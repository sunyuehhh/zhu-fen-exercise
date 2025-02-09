const fs=require('fs')
const EventEmit=require('events')
class ReadStream extends EventEmit{
  constructor(path,options){
    super()
    this.path=path
    this.flags=options.flags||'r';
    this.encoding=options.encoding||null;
    this.mode=options.mode||0o666;
    this.autoClose=options.autoClose||true;
    this.emitClose=options.emitClose||true;
    this.start=options.start||0;
    this.end=options.end;
    this.highWaterMark=options.highWaterMark||64*1024;

    this.pos=this.start;
    

    this.flowing=false;//非流动模式



    this.on('newListener',(type)=>{
      if(type=='data'){
        this.flowing=true
        this.read()

      }
    })

    this.open()
  }

  destroy(err){
    if(this.fd){
      fs.close(this.fd,()=>this.emit('close'))
    }
    if(err){
      this.emit('error',err)
    }
  }

  open(){
    fs.open(this.path,this.flags,this.mode,(err,fd)=>{
      if(err) this.destroy(err)
        this.fd=fd
        this.emit('open',fd)
    })
  }

  pause(){
    this.flowing=false
  }

  resume(){
    if(!this.flowing){
      this.flowing=true
      this.read()
    }
  }

  read(){
    if(typeof this.fd!=='number'){
      return this.once('open',()=>this.read())
    }
    const buffer=Buffer.alloc(this.highWaterMark)
    const howMatchToRead=this.end?Math.min(this.end-this.pos+1,this.highWaterMark):this.highWaterMark
    fs.read(this.fd,buffer,0,howMatchToRead,this.pos,(err,bytesRead)=>{
      if(err) return this.destroy()
      if(bytesRead==0){
        this.emit('end')
      }else{
        this.pos+=bytesRead
        this.emit('data',buffer.slice(0,bytesRead))
        if(this.flowing){
          this.read()
        }
      }


    })
  }


}


module.exports=ReadStream
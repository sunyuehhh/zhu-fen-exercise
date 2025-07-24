let {inherits}=require('util')
let Transform=require('./Transform')
function PassThrough(options){
  Transform.call(this,options)

}

inherits(PassThrough,Transform)
PassThrough.prototype.transform=function (buffer,encoding,next){
  next(null,buffer)

}
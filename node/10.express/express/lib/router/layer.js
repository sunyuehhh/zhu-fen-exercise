function Layer(path,handle){
  this.path=path
  this.handle=handle

}

Layer.prototype.match=function(path){
  // 用于层匹配的逻辑  更容易进行扩展操作
  return this.path==path

}


// 最外层的layer
Layer.prototype.handle_request=function(req,res,next){
  // 交给route的dispatch来处理
  this.handle(req,res,next)

}

Layer.prototype.handle_fn=function(req,res,next){
  // 交给route的dispatch来处理
  this.handle(req,res,next)

}


module.exports=Layer
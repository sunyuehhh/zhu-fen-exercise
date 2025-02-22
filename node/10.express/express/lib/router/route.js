const Layer=require('./layer')
function Route(){
  // 每个路由的layer 都对应一个route  存放的是用户定义的真正的函数
  this.stack=[]

}


Route.prototype.get=function(handlers){
  handlers.forEach((handle) => {
    const layer=new Layer('*******',handle)
    layer.method='get'
    this.stack.push(layer)
    
  });



}

Route.prototype.dispatch=function(req,res,out){
  const method=req.method.toLowerCase()
  let idx=0
  const next=()=>{
    if(idx>=this.stack.length) return out()
      const layer=this.stack[idx++]
    if(layer.method==method){
      layer.handle_fn(req,res,next)
    }else{
      next()
    }
  }

  next()
}


module.exports=Route
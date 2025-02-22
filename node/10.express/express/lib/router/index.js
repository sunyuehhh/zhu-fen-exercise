const url=require('url')
const Layer=require('./layer')
const Route=require('./route')
function Router(){
  this.stack=[

  ]
}


// 这个get意味着你绑定的请求方法是get  用户每调用一次方法  就产生了一个layer
// router -stack[layer(path,dispatch)]
Router.prototype.get=function(path,handlers){
  const route=new Route()

  route.get(handlers)
  const layer=new Layer(path,route.dispatch.bind(route))
  layer.route=route;//每一个路由都存放一个route属性  用来存放真实回调
  this.stack.push(layer)

  console.dir(this.stack,{depth:10})

}


Router.prototype.handle=function(req,res,out){
  const {pathname,query}=url.parse(req.url)

  let idx=0
  const next=()=>{
    // 说明路由中无法匹配到对应的逻辑
    if(idx>=this.stack.length)  return out();//路由处理不到交给应用
    let layer=this.stack[idx++]
    if(layer.match(pathname)){
      // 调用route中的dispatch方法
      layer.handle_request(req,res,next)
    }


  }


  next()

}


module.exports=Router
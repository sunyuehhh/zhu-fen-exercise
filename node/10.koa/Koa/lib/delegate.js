/**
 * 定义一个Delegator构造函数  接收两个参数
 * @param {*} proto  代理哪个对象
 * @param {*} target 目标属性
 */
function Delegator(proto,target){
  // 如果this不是当前类得实例 或者说构造函数得实例得话
  if(!(this instanceof Delegator)){
    return new Delegator(proto,target)
  }
  this.proto=proto
  this.target=target
}

// 再Delegator得原型上定义一个方法getter ,此方法接收一个参数  叫属性名
Delegator.prototype.getter=function(name){
  // proto=context   target=request
  const {proto,target}=this
  // 给proto也就是context对象定义header属性  context.header
  Object.defineProperty(proto,name,{
    get(){
      // this.request.header
      return this[target][name]
    },
    configurable:true
  })
  return this;//返回代理对象对象 以方便后续进行链式调用
}



Delegator.prototype.setter=function(name){
  // proto=context   target=request
  const {proto,target}=this
  Object.defineProperty(proto,name,{
    set(val){
      this[target][name]=val
    },
    configurable:true
  })
  return this;//返回代理对象对象 以方便后续进行链式调用
}


Delegator.prototype.access=function(name){
  return this.getter(name).setter(name)
}

Delegator.prototype.method=function(name){
  // proto=context   target=request
  const {proto,target}=this
  // 给proto也就是context对象定义set方法属性
  // 当调用set方法得时候  内部会调用this.response.set()
  proto[name]=function(){
    // this[target][name]=set方法  this[target]=response  arguments传递给set方法得参数
    return this[target][name].apply(this[target],arguments)
  }
  return this;//返回代理对象对象 以方便后续进行链式调用
}

module.exports=Delegator
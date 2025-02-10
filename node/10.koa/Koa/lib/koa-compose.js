/**
 * 把中间件函数数组合成一个函数  异步串行
 * @param {*} middleware 
 */
function compose(middleware){
  return function(context){
    let index=-1
    function dispatch(i){
      // 如果说当亲将要派发的i 已经小于等于index  说明已经走回头路了
      if(i<=index){
        return Promise.reject(new Error(`next() called multiple times`))
      }
      // 每次派发的时候  会把i赋值给变量index
      index=i
      let fn=middleware[i];
      if(!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context,()=>dispatch(i+1)))
      } catch (error) {
        return Promise.reject(error)
        
      }
    }
    return dispatch(0)

  }
}


module.exports=compose
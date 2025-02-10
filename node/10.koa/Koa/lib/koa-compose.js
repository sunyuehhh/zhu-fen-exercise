/**
 * 把中间件函数数组合成一个函数  异步串行
 * @param {*} middleware 
 */
function compose(middleware){
  return function(context){
    function dispatch(i){
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
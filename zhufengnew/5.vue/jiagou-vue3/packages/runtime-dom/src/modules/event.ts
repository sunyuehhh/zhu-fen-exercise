function createInvoker(nextVal){
  const fn=(e)=>fn.value(e)
  fn.value=nextVal
  return fn
}


export function patchEvent(el,rawName,nextVal){
  // remove add
  // el.addEventListener(key.slice(2).toLowerCase,nextVal,fn)
  // fn1,fn2
  // const fn=()=>{fn.value()}

  // fn.value=fn2
  // 

  const invokers=el._vei||(el._vei={});//缓存列表

  let eventName=rawName.slice(2).toLowerCase()

  // 看一下是否绑定过这个条件
  const existingInvoker=invokers[eventName]

  if(nextVal && existingInvoker){
    // 有新值并且绑定事件   需要换绑操作、
    existingInvoker.value=nextVal

  }else{
    // 这里意味着不存在绑定过
    if(nextVal){
      const invoker = (invokers[eventName] = createInvoker(nextVal))
      el.addEventListener(eventName,invoker)
      // 有没有新的事件
    }else if(existingInvoker){
      // 没有新值,但是之前绑定过事件了
      el.removeEventListener(eventName,existingInvoker)
      invokers[eventName] = null

    }
  }

}

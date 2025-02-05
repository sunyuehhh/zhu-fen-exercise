const PENDING="PENDING"
const FULFILLED="FULFILLED"
const REJECTED="REJECTED"

// 此函数主要目的是判读x是不是promise
// 规范中说明  物品们的promise可以和别人的promise互通
function resolvePromise(x,promise2,resolve,reject){
  // x可以是数值  可以是promise
  // 用x的值来绝对promise2是成功还是失败
  if(x==promise2){
    return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>] error  '))
  }
  // promise实例要么是对象  要么是函数
  if(typeof x==='object'&&x!==null||typeof x==='function'){
    let called=false
    try {
      let then=x.then;//看是否有then方法
      if(typeof then==='function'){
        // 手动去调then  因为并没有写成new Promise().then的形式  then里面的函数没有调用    所以手动调用then
        then.call(x,(y)=>{
          if(called)  return
          called=true
          resolvePromise(y,promise2,resolve,reject)
        },(y)=>{
          reject(y)
        })
      }else{
        resolve(x);//{then:{}} |  {}   |  function
      }
    } catch (e) {
      called=true
      reject(e)
      
    }

  }else{
    // 说明x是普通值
    resolve(x)//普通值直接向下传递即可
  }


}
class Promise{

  constructor(executor){
    // 默认promise状态
    this.status=PENDING
    this.value=undefined
    this.reason=undefined
    this.onResolveCallback=[]
    this.onRejectedCallback=[]

    const resolve=(value)=>{
      // 为了满足ECMAScript的功能自己额外添加的
      if(value instanceof Promise){
       return value.then(resolve,reject)
      }
      if(this.status==PENDING){
      this.value=value
      this.status=FULFILLED
      this.onResolveCallback.forEach(fn=>fn())
      }


      
    }

    const reject=(reason)=>{
      if(this.status==PENDING){
      this.reason=reason
      this.status=REJECTED
      this.onRejectedCallback.forEach(fn=>fn())
      }
    }

      try{//如果executor失败  相当于调用reject
      executor(resolve,reject)
      }catch(e){
        reject(e)
      }
    



  }

  then(onFulfilled,onRejected){
    onFulfilled=typeof onFulfilled==='function'?onFulfilled:(data)=>data
    onRejected=typeof onRejected=='function'?onRejected:(reason)=>{throw reason}

    let promise2=new Promise((resolve,reject)=>{
      if(this.status==FULFILLED){
        process.nextTick(()=>{
          try{
            let x= onFulfilled(this.value)
            resolvePromise(x,promise2,resolve,reject)
            }catch(e){
              reject(e)
    
            }
        })
      }
  
      if(this.status==REJECTED){
        process.nextTick(()=>{
          try {
            let x=onRejected(this.reason)
            resolvePromise(x,promise2,resolve,reject)
            
          } catch (e) {
            reject(e)
            
          }
        })
      }
  
      if(this.status===PENDING){
        this.onResolveCallback.push(()=>{
          process.nextTick(()=>{
            try {
              let x=onFulfilled(this.value)
              resolvePromise(x,promise2,resolve,reject)
            } catch (e) {
              reject(e)
              
            }
          })
        })
        this.onRejectedCallback.push(()=>{
          process.nextTick(()=>{
            try {
              let x=onRejected(this.reason)
              resolvePromise(x,promise2,resolve,reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }

    })

    return promise2


  }



}



Promise.deferred=function(){
  const did={}
  did.process=new Promise((resolve,reject)=>{
    did.resolve=resolve
    did.reject=reject

  })
  return did
}
// npm install promise-aplus-tests -D
// 执行命令   promise-aplus-test3 promise.js  会测试  看代码是否符合规范



Promise.resolve=(value)=>{
  return new Promise((resolve,reject)=>{
    resolve(value)
  })
}


Promise.race=function(values){
  return new Promise((resolve,reject)=>{
    values.forEach((item,i)=>{
      Promise.resolve(item).then(resolve,reject)

    })

  })

}

Promise.prototype.finally=function(fn){
  return this.then(()=>{
    fn()
  },()=>{
    fn()
  })

}

module.exports=Promise
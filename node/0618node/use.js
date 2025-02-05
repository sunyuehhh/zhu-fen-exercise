// 1.Promise是一个类  使用的时候需要new Promise来产生一个promise实例
// 2.构造函数中需要传递一个参数executor
// 3.executor函数中有两个参数  resolve(value)   reject(reason)
// 调用resolve会让promise变成成功   调用reject会变成失败   pending等待  fulfilled成功态  rejected  失败
// 如果发生异常也会认为是失败
// executor是立即执行的
const Promise=require('./promise.js')
const promise=new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve('111111')
  },1000)
})

  promise.then(()=>{
    console.log('成功')
  },()=>{
    console.log('失败')
  })

  
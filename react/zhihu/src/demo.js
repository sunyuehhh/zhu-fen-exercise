const delay=(interval=1000)=>{
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve(`@@${interval}`)
    },interval)
  })
}


// // 需求:串行请求，有三个请求[请求需要的时间分别是1000/2000/3000]?
// delay(1000).then(value=>{
//   console.log('第一个请求成功',value)

//   return delay(2000)
// }).then(value=>{
//   console.log('第二个请求成功',value)

//   return delay(3000)
// }).then(value=>{
//   console.log('第三个执行成功',value)
// }).catch(reason=>{
//   console.log('仍和请求失败,都执行这里')
// })




// (async ()=>{
//   try {
//     let value=await delay(1000)
//     console.log(value,'第一个请求成功')

//     let value2=await delay(2000)
//     console.log(value2,'第2个请求成功')

//     let value3=await delay(3000)
//     console.log(value3,'第3个请求成功')
    
//   } catch (reason) {
//     console.log('任何请求失败,都执行这里',reason)
    
//   }
// })()


const handle=function* handle(){
  let value=yield delay(1000)
  console.log(value,'第一个请求成功')

  let value2=yield delay(2000)
  console.log(value2,'第2个请求成功')

  let value3=yield delay(3000)
  console.log(value3,'第3个请求成功')
}

// let itor=handle()


const AsyncFunction=function AsyncFunction(...params){
  let itor=handle(...params)
  const next=x=>{
    let {done,value}=itor.next(x)
    if(done) return 
    if(!(value instanceof Promise)) value=Promise.resolve(value);
    value.then(next)
  }

  next()

}

AsyncFunction()













// let {done,value}=itor.next()
// // done:是否执行完毕  value:获取的是每一次yield后面的值[Promise实例]
// value.then(x=>{
//   // x:第一个请求成功的结果
//   console.log(x,'x')
//   let {value,done}=itor.next(x)
//   value.then(x=>{
//     let {done,value}=itor.next(x)
//     value.then(x=>{
//       itor.next(x)
//     })
//   })
// })



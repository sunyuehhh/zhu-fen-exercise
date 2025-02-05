const fs=require('fs')
const path=require('path')
const Promise=require('./promise.js')


function readFile(url){
  return new Promise((resolve,reject)=>{
    fs.readFile(url,'utf8',function(err,data){
      if(err) reject(err)
        resolve(data)

    })

  })

}

// Promise的链式调用
// 1.返回的是一个普通值(非promise值)  这个值会被传到外层then的下一个then成功中去
// 2.没有返回值(),会执行外层的then的下一个then的失败
let promise2=readFile(path.resolve(__dirname,'name.txt')).then(data=>{
  // return undefined
  return (new Promise((resolve,reject)=>{
    resolve('1')
  }))//x 决定
  // return 100
  // throw new Error('错误')
})
promise2.then(data=>{
  console.log(data,'outer')
},err=>{
  console.log(err,'error')
})


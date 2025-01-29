const fs=require('fs')
const path=require('path')

let promise=new Promise((resolve,reject)=>{
  resolve()

})
// 如果返回的是promise2  那么会涉及到promise2等待promise2成功   自己等待自己完成
let promise2=promise.then(()=>{
  return promise2
})


promise2.then(data=>{
  console.log(data,'outer')
},err=>{
  console.log(err,'error')
})
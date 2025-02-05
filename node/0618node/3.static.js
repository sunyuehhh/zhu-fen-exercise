// ECMAScript 为了更方便还提供了更好的方法
// Promise.all  等待所有的promise都成功才成功，有一个失败就失败了
const fs=require('fs')
const path=require('path')

Promise.all=function(values){
  return new Promise((resolve,reject)=>{
    let idx=0;
    let result=[];
    values.forEach((item,i) => {
      Promise.resolve(item).then((val)=>{
        result[i]=val;//数组的长度不准确，用索引映射成功的结果
        if(values.length-1==i){
          resolve(result)
        }
      },reject)//如果任何一个promise失败了那么all就失败了
      
    });

  })

}




// 哪个接口快用哪个




function withAbort(userPromise){
  let abort;
  const internalPromise=new Promise((resolve,reject)=>{
    abort=reject
  })

  let p=Promise.race([userPromise,internalPromise])
  p.abort=abort;
  return p

}

let p=new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve(100)
  },3000)
})

p=withAbort(p)

setTimeout(()=>{
p.abort('超时了')
},2000)
p.then(data=>{
  console.log(data)
}).catch(err=>{//如果让这个promise  走向失败
  console.log(err,'err')
})
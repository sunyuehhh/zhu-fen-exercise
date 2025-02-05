const fs=require('fs')
const path=require('path')
const util=require('util')


function promisify(fn){//高阶函数
  return (...args)=>{
    return new Promise((resolve,reject)=>{
        const data=fn(...args,(err,data)=>{
          if(err) reject(err)
            resolve(data)

        })
    })
  }
}



// 只针对node   因为node中函数参数第一个永远是错误的   基于传递的参数构建promise
let readFile=util.promisify(fs.readFile)

readFile(path.resolve(__dirname,'name.txt'),'utf-8').then(data=>{
  console.log(data)
})
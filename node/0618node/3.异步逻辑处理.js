const fs=require('fs')//file System
const path=require('path')

let person={}

function after(times,callback){//高阶函数来处理异步问题
  return function(){
    if(--times==0){
      callback()
    }
  }

}


const out=after(2,function(){
  console.log(person)
})

// 异步和同步的区别
// node中的api  第一个参数都是err   意味这个error-first  优先错误处理
fs.readFile(path.resolve(__dirname,'name.txt'),'utf8',function(err,data){
  console.log(data)
  person.name=data
  out()

})


fs.readFile(path.resolve(__dirname,'age.txt'),'utf8',function(err,data){
  console.log(data)
  person.age=data
  out()

})

// 同步多个异步操作的返回值结果   (Promise.all)

const fs=require('fs')//file System
const path=require('path')

let person={}

let event={
  _arr:[],
  on(callback){
    this._arr.push(callback)//把函数存起来
  },
  emit(...args){
    this._arr.forEach(fn=>fn(...args))//发布就就是将函数拿出来一个个执行

  }
}


event.on(function(){
  // 每次读取成功后我就会打印消息
  console.log('读取成功一次')

})

event.on(function(){
  if(Object.keys(person).length==2){
    console.log('当前已经读取完毕了')
    console.log(person,'person')
  }
})

// 异步和同步的区别
// node中的api  第一个参数都是err   意味这个error-first  优先错误处理
fs.readFile(path.resolve(__dirname,'name.txt'),'utf8',function(err,data){
  console.log(data)
  person.name=data
  event.emit(1)

})


fs.readFile(path.resolve(__dirname,'age.txt'),'utf8',function(err,data){
  console.log(data)
  person.age=data
  event.emit(2)
})

// 同步多个异步操作的返回值结果   (Promise.all)

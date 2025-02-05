// 生成器   在生成的过程中可以暂停  可以自己控制是否继续

// 数组迭代器   生成器是用来生成迭代器
// [...]   可以将我们的类数组转换为数组
// 类数组?  索引，长度，能遍历


//Symbol.iterator 元编程,可以更改我们js的具体逻辑   Object.prototype.toString.call

// let obj={
//   get [Symbol.toStringTag](){
//     return 'abc'
//   }
// }
// console.log(obj.toString())//结果是:[object abc]
// let likeArray={0:1,1:2,2:3,length:3,[Symbol.iterator]:function *(){
//   let i=0;
//   let len=this.length
//   while(len!=i){
//     yield this[i++]
//   }
// }}//不能转换为数组
// // const arr=Array.from(likeArray);//可以转换为数组
// const arr=[...likeArray]
// console.log(arr,'arr')


// function* gen(){
//   try {
//     let a= yield 1;//js执行是先走等号右边  遇到yield就停止了  所以只走了yield 1,并没有给a赋值
//     console.log(a);
//      let b=yield 2;//yield的返回值是下一次调用next传递的参数
//      console.log(b)
//     let c= yield 3;
//     console.log(c)
//      return undefined;
//   } catch (error) {
//     console.log(error)
    
//   }
// }
// let it=gen();//iterator 迭代器  返回的就是迭代器
// console.log(it.next('aaa'))//{ value: 1, done: false }  第一次调用next方法传递的参数没有任何意义
// it.throw('错误');//调用了第一次next的时候 可以暂停逻辑 如果觉得这个逻辑有异常 后续可以通过throw方法
// console.log(it.next('abc'))
// console.log(it.next('abcd'))
// console.log(it.next())



const fs=require('fs/promises')
const path=require('path')
// const co=require('co')//别人写的  需要安装


function co(it){
  return new Promise((resolve,reject)=>{//同步迭代用for循环  异步迭代用回调
    function next(data){
      let {value,done}=it.next(data)
      if(!done){//如果没完成  返回的一定是个promise
        Promise.resolve(value).then(data=>{
          next(data)
        },reject)
      }else{
        resolve(value)
      }
    }


    next()

  })

}



function* readResult(){//依旧是异步的方法 只是看起来像同步的
    let filename=yield fs.readFile(path.resolve(__dirname,'name.txt'),'utf8');
    let age=yield fs.readFile(path.resolve(__dirname,filename),'utf8')
    return age
}



co(readResult()).then(data=>{
  console.log(data)
})

// let it=readResult()
// let {value,done}=it.next()
// value.then(data=>{
//   let {value,done}=it.next(data)
//   value.then(data=>{
//     console.log(data)
//   })
// })




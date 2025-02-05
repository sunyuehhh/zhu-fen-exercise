// Promise.resolve 是ECMAScript自己实现的(为了能快读创建promise并且具备等待效果)
const Promise=require('./promise')

// Promise.resolve  有一个特点就是会产生一个新的promise  如果你传入的值是promise
// Promise.resolve  可以解析传入的promise  具备等待效果
Promise.resolve(new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve('abc')
  },1000)

})).then(data=>{console.log(data)})


Promise.reject('error').then(data=>{
  console.log(data,'data')
},function(err){
  console.log(err,'err')
})
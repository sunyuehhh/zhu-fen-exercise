// let AsyncQueue=require('webpack/lib/util/AsyncQueue')
let AsyncQueue=require('./AsyncQueue')
/**
 * 处理器
 * @param {*} item 条目
 * @param {*} callback 处理完成后的回调
 */
function processor(item,callback){
  setTimeout(()=>{
    console.log('处理',item)
    callback(null,item)
  },3000)

}

/**
 * 返回此条目的唯一标识
 * @param {*} item 条目
 * @returns 
 */
function getKey(item){
  return item.key

}
let queue=new AsyncQueue({
  name:'创建模块',
  parallelism:3,//同时执行的异步任务并发数
  processor,//如何创建模块 每个条目 要经过如何处理
  getKey
})


const startTime=Date.now()
let item1={key:'item1'}
queue.add(item1,(err,result)=>{
  console.log(err,result)
  console.log(Date.now()-startTime)

})

let item2={key:'item2'}
queue.add(item2,(err,result)=>{
  console.log(err,result)
  console.log(Date.now()-startTime)

})

let item3={key:'item3'}
queue.add(item3,(err,result)=>{
  console.log(err,result)
  console.log(Date.now()-startTime)

})
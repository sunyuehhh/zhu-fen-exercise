// 检测timers中是否有已经到达时间任务
// 进入poll阶段，主要就是检测是否有文件读写操作的回调，让它依次执行
// 检测一下是否用户编写了setImmediate，就去执行setImmiedate,如果没有check相关的内容，则会再poll阶段阻塞
// 每个阶段存放的任务都是宏任务  ，每个宏任务执行完毕后会清空微任务队列
// node10之前执行的方式是每个阶段执行完毕后  会清空微任务
// process.nextTick 优先级高于微任务(宏任务->nextTick->清空微任务->再拿出下一个宏任务)

setTimeout(()=>{
  console.log('setTimeout')
},0)

setImmediate(()=>{
  console.log('setImmediate')
})
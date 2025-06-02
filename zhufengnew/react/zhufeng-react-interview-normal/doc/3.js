// 在组件更新时候会用到
function dispatchAction(queue,action){
  const update={
    action,
    next:null
  };//创建一个update对象
  const pending=queue.pending
  if(pending===null){
    update.next=update;//让自己和自己构建成一个循环链表  环状链表

  }else{
    update.next=pending.next
    pending.next=update
  }

  queue.pending=update


}
// 队列
let queue={
  pending:null
}

dispatchAction(queue,'action1')
dispatchAction(queue,'action2')
dispatchAction(queue,'action3')


const pendingQueue=queue.pending
if(pendingQueue!==null){
  let first=pendingQueue.next //第一个节点
  let update=first
  do{

    console.log(update)
    update=update.next
  }while(update!==first)
}
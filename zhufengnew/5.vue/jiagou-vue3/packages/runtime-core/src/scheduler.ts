const queue=[]
let isFlushing=false

const p=Promise.resolve()
export function queueJob(job){
  if(!queue.includes(job)){
    queue.push(job);//存储当前的更新的操作
  }

  // 数据变化 可能会出现多个组件的更新  所以需要采用队列来存储
  if(!isFlushing){
    isFlushing=true

    p.then(()=>{
      isFlushing=true
      let copyQueue=queue.slice(0);//将当前重新执行的队列拷贝一份 并且清空队列
      queue.length=0

      copyQueue.forEach((job)=>{
        job()

      })

      copyQueue.length=0
    })
  }
}
function logEvents(gulpInst){
  // 再undertaker 执行任务的时候  触发一个start事件
  gulpInst.on('start',(evt)=>{
    console.log(`[20:34:59] Starting '${evt.name}'...`)
  })

  gulpInst.on('stop',(evt)=>{
    console.log(`[20:34:59] Finished '${evt.name}' after ${evt.duration[0]} ms`)

  })


}



module.exports=logEvents
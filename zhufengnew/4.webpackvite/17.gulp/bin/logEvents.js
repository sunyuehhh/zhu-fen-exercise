const chalk=require('chalk')

/**
 * 在gulp执行任务的时候会在任务开始前发射start事件
 * 任务结束后发射stop事件
 * Undertaker继承自EventEmitter
 * @param {*} gulpInst 
 */
function logEvents(gulpInst){
  gulpInst.on('start',function(event){
    const {name}=event
    console.log(`[20:42:21] Starting '${chalk.cyan(name)}'...`)

  })

  gulpInst.on('stop',function(event){
    const {name,duration}=event
    console.log(`[20:42:21] Finished '${chalk.cyan(name)}' after ${chalk.magenta(duration[0])}ms`)

  })

  
}

module.exports=logEvents
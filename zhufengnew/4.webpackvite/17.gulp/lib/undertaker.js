let EventEmitter=require('events')
function UnderTaker(){
  EventEmitter.call(this)
  this._tasks={}
}

Object.setPrototypeOf(UnderTaker.prototype,EventEmitter.prototype)
Object.setPrototypeOf(UnderTaker,EventEmitter)
function task(taskName,task){
  this._tasks[taskName]=task

}

UnderTaker.prototype.task=task


module.exports=UnderTaker
function EventEmitter(){
  this._events={}


}

EventEmitter.prototype.on=function(eventName,callback){
  if(!this._events) this._events={};
  if(eventName!=='newListener'){
    this.emit('newListener',eventName)
  }
  (this._events[eventName]||(this._events[eventName]=[])).push(callback)

}

EventEmitter.prototype.once=function(eventName,callback){
  function once(){
    callback()
    this.off(eventName,callback)
  }
  this.on(eventName,once)

}

EventEmitter.prototype.emit=function(eventName,...args){
  if(!this._events) this._events={}
  this._events[eventName]&&( this._events[eventName].forEach(fn =>fn(...args)));

}

EventEmitter.prototype.off=function(event,callback){
  if(!this._events) this._events={}
  let callbacks=this._events[eventName]
  if(callbacks){
    this._events[eventName]=callbacks.filter(item=>item!==callback)
  }

}


module.exports=EventEmitter

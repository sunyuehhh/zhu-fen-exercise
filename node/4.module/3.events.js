const EventEmit=require('./events')
const util=require('util')//util.promisify
const events=new EventEmit()



function Girl(){

}

util.inherits(Girl,EventEmit)

// 实现继承的几种方式   obj.prototype.__proto__=parent.prototype
//                    obj.prototype=Object.create(parent.prototype)
//                    Object.setPrototypeOf(obj.prototype,parent.prototype)

// on emit
const girl=new Girl()
let waiting=false
girl.on('newListener',function(eventName){
  if(!waiting){
    process.nextTick(()=>{
      girl.emit(eventName)
      waiting=false
    })
    waiting=true
  }

})


girl.on('女生失恋',(val)=>{
  console.log('哭',val)

})

girl.on('女生失恋',(val)=>{
  console.log('吃',val)

})
let util=require('util')
let EventEmitter=require('events')
function Undertaker(){
  EventEmitter.call(this)

  // 存放任务
  this._tasks={}
}


function task(name,fn){
  this._tasks[name]=fn

}

function series(){
  // 拿到所有的要串行执行函数数组
  let args=Array.from(arguments)
  let fn=buildSeries(args)
  return fn.bind(this)


}


function parallel(){
  // 拿到所有的要并行执行函数数组
  let args=Array.from(arguments)
  let fn=buildParallel(args)
  return fn.bind(this)

}

Undertaker.prototype.task=task
Undertaker.prototype.series=series
Undertaker.prototype.parallel=parallel


function buildSeries(values){
  function series(done){
    let self=this
    let length=values.length
    let idx=0
    let results=[];
    function next(idx){
      let value=values[idx]
      if(typeof value!=='function'){
        value=self._tasks[value]
      }
      let startMS=Date.now()
      self.emit('start',{name:value.name})
      value((err,result)=>{
        self.emit('stop',{
          name:value.name,
          duration:[Date.now()-startMS]
        })
        results[idx]=result
        if(++idx>=length){
          done(err,results)
        }else{
          next(idx)
        }


      })

    }

    next(idx)

  }


  return series

}



function buildParallel(values){
  function parallel(done){
    let self=this
    let length=values.length
    let count=length
    let results=[]
    function next(idx){
      let startMS=Date.now()
      self.emit('start',{name:value.name})
      let value=values[idx]
      if(typeof value!=='function'){
        value=self._tasks[value]
      }
      value((err,result)=>{
        self.emit('stop',{
          name:value.name,
          duration:[Date.now()-startMS]
        })
        results[idx]=result
        if(--count==0){
          done(err,results)

        }

      })

    }


    for(idx=0;idx<length;idx++){
      next(idx)
    }

  }


  return parallel
}





util.inherits(Undertaker,EventEmitter)
module.exports=Undertaker
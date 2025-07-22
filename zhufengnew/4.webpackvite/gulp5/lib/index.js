const {inherits}=require('util')
const Undertaker=require('undertaker')
function Gulp(){
  Undertaker.call(this)
  // 把原想上的task方法绑定当前的Gulp对象实例为this后赋给this.task
  this.task=this.task.bind(this)
  this.series=this.series.bind(this)
  this.parallel=this.parallel.bind(this)
}
// 继承
inherits(Gulp,Undertaker)
const inst=new Gulp()


module.exports=inst
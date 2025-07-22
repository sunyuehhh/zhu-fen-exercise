const {inherits}=require('util')
const Undertaker=require('undertaker')
// var vfs=require('vinyl-fs')
var vfs=require('./vinyl-fs')
function Gulp(){
  Undertaker.call(this)
  // 把原想上的task方法绑定当前的Gulp对象实例为this后赋给this.task
  this.task=this.task.bind(this)
  this.series=this.series.bind(this)
  this.parallel=this.parallel.bind(this)

  this.src=this.src.bind(this)
  this.dest=this.dest.bind(this)
}
// 继承
inherits(Gulp,Undertaker)
Gulp.prototype.src=vfs.src
Gulp.prototype.dest=vfs.dest
const inst=new Gulp()


module.exports=inst
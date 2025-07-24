const util=require('util')
const UnderTaker=require('undertaker')
function Gulp(){
  // 把子类的实例传给父类的构造函数  是用来实例化父亲的私有属性
  UnderTaker.call(this)
  // 把父类里的定义仍无的方法绑定this后赋给this.task
  this.task=this.task.bind(this)
  this.series=this.series.bind(this)
  this.parallel=this.parallel.bind(this)

}


// 继承父类上的实例方法和属性
Object.setPrototypeOf(Gulp.prototype,UnderTaker.prototype)
// 继承父类身上的静态方法和属性
Object.setPrototypeOf(Gulp,UnderTaker)

const inst=new Gulp()
module.exports=inst
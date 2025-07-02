let id=0
class Dep{
  constructor(){
    this.subs=[]
    this.id=id++
  }
  depend(){
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)

  }

  addSub(watcher){
    this.subs.push(watcher)
  }

  notify(){
    this.subs.forEach(watcher=>watcher.update())
  }
}


Dep.target=null;//静态属性  就一份
let stack=[]


export function pushTarget(watcher){
  Dep.target=watcher;//保留watcher
  stack.push(watcher);//有渲染watcher 其他watcher

}

export function popTarget(watcher){
  // Dep.target=null //将变量删除掉
  stack.pop()
  Dep.target=stack[stack.length-1];//将变量删除掉

}

export default Dep


// 多对多的关系  一个属性有一个dep是用来收集watcher的
// dep  可以存搓个watcher
// 一个watcher 可以对应多个dep
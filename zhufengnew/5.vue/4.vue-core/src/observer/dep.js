class Dep{
  constructor(){
    this.subs=[]
  }
  depend(){
    this.subs.push(Dep.target)

  }

  notify(){
    this.subs.forEach(watcher=>watcher.update())
  }
}

export function pushTarget(watcher){
  Dep.target=watcher

}

export function popTarget(watcher){
  Dep.target=null //将变量删除掉

}

export default Dep


// 多对多的关系  一个属性有一个dep是用来收集watcher的
// dep  可以存搓个watcher
// 一个watcher 可以对应多个dep
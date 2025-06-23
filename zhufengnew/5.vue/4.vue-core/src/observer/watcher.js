import { pushTarget,popTarget } from "./dep"
let id=0

export class Watcher{
  // vm实例
  // exprOrFn  vm._update(vm._render())
  constructor(vm,exprOrFn,cb,options){
    this.vm=vm
    this.exprOrFn=exprOrFn
    this.cb=cb
    this.options=options

    this.deps=[];//watcher记录有多少dep依赖他
    this.depsId=new Set()

    if(typeof exprOrFn==='function'){
      this.getter=exprOrFn
    }

    this.get()


  }


  addDep(dep){
    let id=dep.id
    if(!this.depsId.has(id)){
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }

  get(){
    pushTarget(this);//当前watcher实例
    this.getter()
    popTarget();
  }

  update(){
    this.get()
  }
}
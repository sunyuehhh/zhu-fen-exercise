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

    if(typeof exprOrFn==='function'){
      this.getter=exprOrFn
    }

    this.get()


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
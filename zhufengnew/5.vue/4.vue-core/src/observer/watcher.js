import { pushTarget,popTarget } from "./dep"
import { nextTick } from "../utils"
let id=0

export class Watcher{
  // vm实例
  // exprOrFn  vm._update(vm._render())
  constructor(vm,exprOrFn,cb,options={}){
    this.vm=vm
    this.exprOrFn=exprOrFn
    this.cb=cb
    this.options=options

    this.user=options.user;//这是一个用户watcher

    this.isWatcher=!!options;//是渲染watcher


    this.lazy=options.lazy;//如果watcher上有lazy属性 说明是一个计算属性
    this.dirty=this.lazy;//dirty代表取值时是否执行用户提供的方法

    this.deps=[];//watcher记录有多少dep依赖他
    this.depsId=new Set()

    if(typeof exprOrFn==='function'){
      this.getter=exprOrFn
    }else{
      this.getter=function(){
        // exprOrFn 可能传递过来的是一个字符串a 
        // 当去当前实例上取值时  才会触发依赖收集
        let path=exprOrFn.split('.');//['a','a','a']
        let obj=vm
        for(let i=0;i<path.length;i++){
          obj=obj[path[i]]
        }

        return obj

      }
    }

    // 默认会先调用一次get方法  进行取值  将结果保留下来
    this.value=this.lazy?void 0:this.get();//默认会调用get方法


  }

  evaluate(){
    this.value=this.get()
    this.dirty=false;//取过一次值之后  就表示已经取过值了
  }

  depend(){
    // 计算属性watcher 会存储dep  dep会存储watcher
    let i=this.deps.length
    while(i--){
      this.deps[i].depend();//让dep去存储渲染watcher
    }

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
    let result=this.getter.call(this.vm);//调用exprOrFn
    popTarget();

    return result
  }

  run(){
    let newValue=this.get();//渲染逻辑
    let oldValue=this.value
    if(this.user){
      this.cb.call(this.vm,newValue,oldValue)
    }
  }

  update(){
    if(this.lazy){//是计算属性
      this.dirty=true;//页面重新渲染就可以获得最新的值了
    }else{
    // 这里不要每次都调用get方法   get方法会重新渲染页面
    // this.get();//重新渲染
    queueWatcher(this);//暂存的概念
    }
  }
}



function flushSchedulerQueue(){
        queue.forEach(watcher=>{
          watcher.run()
          // watcher.cb()
        })
        queue=[]
        has={}
        pending=false
}
let queue=[];//将需要批量更新的watcher 存在一个队列中  稍后让watcher执行
let has={}
let pending=false
function queueWatcher(watcher){
  const id=watcher.id;
  if(has[id]==null){
    queue.push(watcher)
    has[id]=true
    // 等待所有同步代码执行完毕后再执行
    if(!pending){
      nextTick(flushSchedulerQueue)
    }
  }
}
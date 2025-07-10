export let activeEffect=undefined

function cleanupEffect(effect){
  const {deps}=effect

  for(let i = 0;i<deps.length;i++){
    // 找到set 让set移除掉自己
    deps[i].delete(effect)
  }

  effect.deps.length=0;//清空依赖的列表

}


export class ReactiveEffect{
  // 默认会将fn挂载到来的实例上
  constructor(private fn,public scheduler?){

  }

  parent=undefined
  deps=[];//我依赖了哪些属性

  active=true

  run(){
    // 失活态默认调用run的时候  只是重新执行
    // 不会发生依赖收集
    if(!this.active){
      return this.fn()
    }
    try{
      this.parent=activeEffect
      activeEffect=this

      cleanupEffect(this)

      return this.fn()//fn()会触发依赖收集
    }finally{
      activeEffect=this.parent
      this.parent=undefined
    }
  }

  stop(){
    if(this.active){
      // 失活的意思就是停止依赖收集
       this.active=false
       cleanupEffect(this)
    }
  }
}


export function effect(fn){
  // 创建一个响应式effect  并且让effect执行
  const _effect=new ReactiveEffect(fn)
  _effect.run()

  // 把runner方法直接给用户  用户可以去调用effect中定义的内容
  const runner=_effect.run.bind(_effect)
  // 可以通过runner 拿到effect中所有属性
  runner.effect=_effect

  return runner
}



const targetMap=new WeakMap()
export function track(target,key){
  // 让这个对象上的属性  记录当前的activeEffect

  if(activeEffect){
    // 说明用户在effect中使用的这个数据
    let depsMap=targetMap.get(target)

    // 如果没有创建一个映射表
    if(!depsMap){
      targetMap.set(target,(
        depsMap=new Map()
      ))
    }

    // 如果有这个映射表来查找一下有没有这个属性
    let dep=depsMap.get(key);
    if(!dep){
      depsMap.set(key,(dep=new Set()))
    }

    trackEffects(dep)


  }

}


export function trackEffects(dep){
      // 如果有则看一下set中有没有这个effect
    let shouldTrack=!dep.has(activeEffect)
    if(shouldTrack){
      dep.add(activeEffect)

      // name = new Set(effect)
      // age = new Set(effect)

      // 我可以通过当前的effect 找到这两个集合中的自己  将其移除掉就可以了



      activeEffect.deps.push(dep)
    }
}


export function trigger(target,key,value,oldValue){
  // 通过对象找到对应的属性  让这个属性对应的effect重新执行
  const depsMap=targetMap.get(target)

  if(!depsMap){
    return
  }

  const dep=depsMap.get(key);//name 或者 age 对应所有的effect

  triggerEffects(dep)



}

export function triggerEffects(dep){
  if(!dep) return
    const effects=[...dep]

  effects&&effects.forEach(effect => {
    // 正在执行的effect 不要多次执行
    if(effect!==activeEffect){
      if(effect.scheduler){
         effect.scheduler();//用户传递了对应的更新函数规则
        //  如果用户没有传递则默认就是重新运行effect函数
      }else{
         effect.run()
      }
    }
  });
}
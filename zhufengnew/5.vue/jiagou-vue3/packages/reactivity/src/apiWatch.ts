// watch api 用法很多,常见写法就是监控一个函数的返回值 根据返回值的变化触发对应的函数
// watch 可以传递一个响应式对象 可以监控到对象的变化触发回调

import { isFunction, isObject } from '@vue/shared';
import { isReactive } from './reactive';
import { ReactiveEffect } from './effect';

// = 深拷贝  seen 防止死循环
function traverse(value,seen=new Set()){
  if(!isObject(value)){
    return value
  }

  if(seen.has(value)){
    return value
  }

  seen.add(value)

  for(const key in value){
    traverse(value[key],seen);
  }

  return value
}


export function watch(source,cb,options){
  return dowatch(source,cb,options)

}

export function watchEffect(source,options){
  return dowatch(source,null,options)

}


// watch  watchEffect
export default function dowatch(source,cb,options){
  // 1.source是一个响应式对象
  // 2.source是一个函数
  let getter;
  if(isReactive(source)){
    getter=()=>traverse(source)
  }else if(isFunction(source)){
    getter=source
  }

  let oldVal;


  // 里面的属性就会收集当前的effect
  // 如果数据变化后会执行对应scheduler方法
  let clear;
  let onCleanup=(fn)=>{
    clear=fn

  }


  const job=()=>{
    if(cb){
      if(clear) clear()
      const newVal=effect.run()
      cb(newVal,oldVal,onCleanup)
      oldVal=newVal
    }else{
      effect.run()//watchEffect 只需要运行自身就可以了

    }
  }

  // 里面的属性就会收集当前的effect
  // 如果数据变化后会执行对应的scheduler方法
  const effect=new ReactiveEffect(getter,job)

  oldVal=effect.run()

}
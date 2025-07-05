import { isObject } from '@vue/shared';
import { mutableHandlers } from './handler';

export enum ReactiveFlags {
  IS_REACTIVE='__v_isReactive'
}

const reactiveMap=new WeakMap()
export function reactive(target){
  // reactive 只能处理对象类型的数据  不是对象不处理
  if(!isObject(target)) return target

  // 缓存可以采用映射表  {{target}->proxy}

  let existingProxy=reactiveMap.get(target)

  if(existingProxy) return existingProxy

  if(target[ReactiveFlags.IS_REACTIVE]){
    return target
  }


  const proxy=new Proxy(target,mutableHandlers)

  reactiveMap.set(target,proxy)

  return proxy

}
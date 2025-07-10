import { reactive, ReactiveFlags } from './reactive'
import {track,trigger} from './effect'
import { isObject } from '@vue/shared'
import { isRef } from './ref'

export const mutableHandlers={
    get(target,key,receiver){
      // 取值的时候
      // 我们在使用proxy的时候要搭配reflect来使用  用来解决this问题
      if(key==ReactiveFlags.IS_REACTIVE){
        return true
      }

      // 如果在取值的时候发现取出来的值是对象 那么再次进行代理 返回代理后的结果
      if(isObject(target[key])){
        return reactive(target[key])
      }

      if(isRef(target[key])){
        return target[key].value
      }



      // 做依赖收集  记录属性和当前effect的关系
      const res=Reflect.get(target,key,receiver)
      track(target,key)

      return res
    },
    set(target,key,value,receiver){
      // 更新数据

      // 找到这个数字对应的effect让他执行
      let oldValue=target[key]

      const r=Reflect.set(target,key,value,receiver)

      if(oldValue!==value){
        trigger(target,key,value,oldValue)
      }
     
      return r
    }
  }
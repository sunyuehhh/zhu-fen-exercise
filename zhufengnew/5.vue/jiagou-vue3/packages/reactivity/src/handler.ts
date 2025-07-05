import { ReactiveFlags } from './reactive'
import {track,trigger} from './effect'

export const mutableHandlers={
    get(target,key,receiver){
      // 取值的时候
      // 我们在使用proxy的时候要搭配reflect来使用  用来解决this问题
      if(key==ReactiveFlags.IS_REACTIVE){
        return true
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
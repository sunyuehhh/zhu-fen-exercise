import { arrayMethods } from "./array"
import { defineProperty } from "../utils"
import Dep from "./dep"

class Observer{
  constructor(value){
    // 判断一个对象是否被观测过看他有没有__ob__这个属性
    defineProperty(value,'__ob__',this)

    // 使用defineProperty重新定义属性
    if(Array.isArray(value)){
      // 我希望调用push shift unshift splice sort reverse pop
      // 函数劫持   切片编程
      value.__proto__=arrayMethods
      // 观测数组中的对象类型  对象变化也要做一些事
      this.observeArray(value)

    }else{
    this.walk(value)
    }
  }

  observeArray(value){
    value.forEach(item=>{
      observer(item)//观测数组中的对象类型
    })

  }
  walk(data){
    let keys=Object.keys(data)
    keys.forEach((key)=>{
      defineReactive(data,key,data[key])//Vue.util.defineReactive
    })


  }
}

function defineReactive(data,key,value){
  observer(value)
  let dep=new Dep();//每个属性都有一个dep
  Object.defineProperty(data,key,{
    get(){
      if(Dep.target){
        dep.depend()
      }
      console.log('用户获取值了')
      return value
    },
    set(newValue){
      console.log('设置值')
      if(newValue===value)  return
      observer(newValue) //如果用户将值改为对象  继续监控
      value=newValue

      dep.notify()
    }
  })

}

export function observer(data){
  if(typeof data!=='object'&&data!==null){
    return  data
  }

  if(data.__ob__){
    return data
  }

  return new Observer(data)

}



import { mergeOptions } from "../utils"

export default function initExtend(Vue){

  // 核心就是创建一个子类继承我们得父类
  Vue.extend=function(extendOptions){
    const Super=this
    const Sub=function VueComponent(params){
      this._init(options)

    }

    // 子类要继承父类原型上得方法  原型继承
    Sub.prototype=Object.create(Super.prototype)
    Sub.prototype.constructor=Sub


    Sub.options=mergeOptions(
      Super.options,
      extendOptions
    )

    Sub.components=Super.components
    // ...

    return Sub


  }

}


// 组件得渲染流程
// 1.调用Vue.component
// 2.内部用Vue.extend 就是产生一个子类来继承父类
// 3.等会创建子类实例时会调用父类的_init方法
// 4.组件的初始化就是new 这个组件的构造函数并且调用$mount方法



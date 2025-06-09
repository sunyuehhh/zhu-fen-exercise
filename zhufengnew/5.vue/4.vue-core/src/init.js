import { initState } from "./state"
import {compileToFunction} from './compiler/index.js'
import {mountComponent} from './lifecycle.js'
export function initMixin(Vue){
  Vue.prototype._init=function(options){
    const vm=this
    vm.$options=options


    initState(vm)


    // 如果当前有el属性说明要渲染模板
    if(vm.$options.el){
      vm.$mount(vm.$options.el)

    }

  }


  Vue.prototype.$mount=function(el){
    // 挂载操作
    const vm=this;
    const options=vm.$options
    el=document.querySelector(el)
    vm.$el=el;

    if(!options.render){
      let template=options.template
      if(!template&&el){
        template=el.outerHTML
      }

      // 将模板转换成render函数
      const render=compileToFunction(template)

      options.render=render

    }

    // 渲染时用的就是这个render
    // 需要挂载这个组件
    mountComponent(vm,el)

  }
}



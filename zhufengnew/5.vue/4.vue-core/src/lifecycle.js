import { patch } from "./vdom/patch"
import { Watcher } from "./observer/watcher"
export function lifecycleMixin(Vue){
  Vue.prototype._update=function(vnode){
    console.log(vnode,'vnode')

    const vm=this
    vm.$el=patch(vm.$el,vnode)

  }

}
export function mountComponent(vm,el){
  callHook(vm,'beforeMount')
  // 调用render方法去渲染  el属性

  // 先调用render方法创建虚拟节点  再将虚拟节点渲染到页面上
  // vm._update(vm._render())
  let updateComponent=()=>{
    vm._update(vm._render())
  }

  // 这个watcher是用来渲染的   暂时没有任何功能
  let watch=new Watcher(vm,updateComponent,()=>{
    callHook(vm,'beforeUpdate')
  },true)

  callHook(vm,'mounted')

}


// callHook(vm,'beforeCreate')
export function callHook(vm,hook){
  const handlers=vm.$options[hook]
  if(handlers){
    for(let i=0;i<handlers.length;i++){
      handlers[i].call(vm)
    }
  }

}
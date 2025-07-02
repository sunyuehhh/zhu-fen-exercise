import { patch } from "./vdom/patch"
import { Watcher } from "./observer/watcher"
export function lifecycleMixin(Vue){
  Vue.prototype._update=function(vnode){
    console.log(vnode,'vnode')
    const vm=this
    // 这里需要区分一下  到底是首次渲染还是更新
    const prevVnode=vm._vnode  //如果第一次_vnode不存在

    if(!prevVnode){
      // 用新撞见的元素  替换老的vm.$el
      vm.$el=patch(vm.$el,vnode)
    }else{
      vm.$el=patch(prevVnode,vnode)
    }

    vm._vnode=vnode //保存第一次的vnode

    // vm.$el=patch(vm.$el,vnode)

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
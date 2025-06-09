export function renderMixin(Vue){
  Vue.prototype._c=function(){//创建虚拟dom元素
    return createElement(...arguments)

  }

  Vue.prototype._s=function(val){//stringify
    return val==null?'':(typeof val === 'object')?JSON.stringify(val):val

  }

  Vue.prototype._v=function(text){//创建虚拟dom文本元素
    return createTextVnode(text)
  }
  Vue.prototype._render=function(){
    const vm=this
    const render=vm.$options.render
    
    return render.call(vm)

  }

}

//  _c('div',{},1,2,3,4,5)
function createElement(tag,data={},...children){
  console.log(arguments,'arguments')
  return vnode(tag,data,data.key,children)
}

function createTextVnode(text){
  console.log(text,'text')
  return vnode(undefined,undefined,undefined,undefined,text)
}

// 用来产生虚拟的
function vnode(tag,data,key,children,text){
  return {
    tag,
    data,
    key,
    children,
    text
  }

}
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin, } from "./vdom/index"
import { initGlobalApi } from "./global-api/index"
import {stateMixin} from './state'
function Vue(options){
  this._init(options)//入口方法  做初始化操作


}



initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)


initGlobalApi(Vue)

// 初始化方法

// 为了看到diff的整个流程  创建两个虚拟节点来进行比对操作
import { compileToFunction } from "./compiler/index"
import { createElm,patch} from "./vdom/patch"
let vm1=new Vue({
  data:{
    name:'zf11111111'
  }
})

let render1=compileToFunction('<div id="a" style="color:red">{{name}}</div>')
let vnode1=render1.call(vm1)//render方法返回的是虚拟dom
createElm(vnode1)

document.body.appendChild(createElm(vnode1))

let vm2=new Vue({
  data:{
    name:'jw'
  }
})
let render2=compileToFunction('<div id="b" style="background:blue">{{name}}</div>')
let vnode2=render2.call(vm2)

setTimeout(()=>{
  patch(vnode1,vnode2);//传入新的虚拟节点和老的  做一个对比
},1000)




// new Vue({
//   data:{
//     name:'jw'
//   }
// })




export default Vue
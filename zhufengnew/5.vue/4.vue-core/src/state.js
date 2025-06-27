import { observer } from "./observer/index.js"
import { Watcher } from "./observer/watcher.js"
import { proxy } from "./utils.js"
import { nextTick } from "./utils.js"
export function initState(vm){
  const opts=vm.$options
  if(opts.props){
    initProps(vm)
  }

  if(opts.methods){
    initMethods(vm)
  }

  if(opts.data){
    initData(vm)
  }

  if(opts.computed){
    initComputed(vm)
  }

  if(opts.watch){
    initWatch(vm)
  }

}

function initProps(vm){

}

function initMethods(vm){

}

function initData(vm){
  let data=vm.$options.data

  vm._data=data=typeof data=='function'?data.call(vm):data
  // 数据的劫持方案  对象Object.defineProperty
  // 数组  单独处理

  // 我去vm上取属性时  帮我将属性的取值代理到vm._data上
  for(let key in data){
    proxy(vm,'_data',key)
  }

  console.log(data,'data')

  // 

  observer(data)

}
function initComputed(vm){

}
function initWatch(vm){
  let watch=vm.$options.watch
  console.log(watch,'watch')
  for(let key in watch){
    const handler=watch[key];//handler可能是数组  字符串  对象  函数
    if(Array.isArray(handler)){
      createWatcher(vm,key,handler)
    }else{
      createWatcher(vm,key,handler);//字符串  对象  函数
    }
  }

}


function createWatcher(vm,exprOrFn,handler,options={}){
  if(typeof handler=='object'){
    options=handler
    handler=handler.handler;//是一个函数
  }

  if(typeof handler==='string'){
    handler=vm[handler];//将实例的方法作为handler
  }

  // key handler 用户传入的选项
  return vm.$watch(exprOrFn,handler,options)

}


export function stateMixin(Vue){
  Vue.prototype.$nextTick=function(cb){
    nextTick(cb)
  }

    Vue.prototype.$watch=function(exprOrFn,cb,options){

      //数据应该依赖这个watcher  数据变化后应该让watcher从新执行
      let watcher=new Watcher(this,exprOrFn,cb,{...options,user:true})
      if(options.immediate){
        cb();//如果是immediate应该立即执行
      }



  }
}

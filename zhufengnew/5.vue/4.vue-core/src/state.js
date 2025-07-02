import { observer } from "./observer/index.js"
import { Watcher } from "./observer/watcher.js"
import { proxy } from "./utils.js"
import { nextTick } from "./utils.js"
import Dep from './observer/dep.js'
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
  let computed=vm.$options.computed
  console.log(computed,'computed1111111')
  const watchers=vm._computedWatchers={};//用来稍后存放计算属性的watcher

  for(let key in computed){
    const userDef=computed[key];//取出对应的值来
    // 获取get方法
    const getter=typeof userDef=='function'?userDef:userDef.get//watcher

    watchers[key]=new Watcher(vm,getter,()=>{},{
      lazy:true
    })//watcher很懒

    // defineComputed
    defineComputed(vm,key,userDef) 
  }

}

const sharedPropertyDefinition={}
function defineComputed(target,key,userDef){
  if(typeof userDef==='function'){
    sharedPropertyDefinition.get=createComputedGetter(key)//dirty来控制是否调用
  }else{
    sharedPropertyDefinition.get=createComputedGetter(key) //需要加缓存
    sharedPropertyDefinition.set=userDef.set
  }
  Object.defineProperty(target,key,sharedPropertyDefinition)

}

function createComputedGetter(key){
  return function(){//此方法是我们包装的方法，每次取值会调用此方法
    // if(dirty){//判断到底要不要执行用户传递的方法
    //   // 执行
    // }
    const watcher=this._computedWatchers[key];//拿到这个属性对应watcher
    if(watcher){
      if(watcher.dirty){//默认肯定是脏的
        watcher.evaluate();//对当前watcher求值
      }
      if(Dep.target){//说明还有渲染watcher 也应该一并收集起来
        watcher.depend()

      }

      return watcher.value
    }
  }


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

import { observer } from "./observer/index.js"
import { proxy } from "./utils.js"
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

}


import { ELEMENT_TEXT } from "./constants";
import { scheduleRoot,useReducer } from "./schedule";
import { UpdateQueue,Update } from "./UpdateQueue";
/**
 * 创建元素(虚拟DOM)的方法
 * @param {*} type 元素的类型div span p
 * @param {*} config 配置对象  属性key ref
 * @param  {...any} children 放着所有的儿子，这里会做成一个数组
 */
function createElement(type,config,...children){
  console.log(type,config,children,'*****')
  delete config._self
  delete config._source;//表示这个元素是在哪行哪列哪个文件生成的
  return {
    type,
    props:{
      ...config,//做了一个兼容处理  如果是React元素的话返回自己  如果是文本类型，如果是一个字符串的话，返回元素的对象
      children:children.map(child=>{
        return typeof child==='object'?child:{
          type:ELEMENT_TEXT,
          props:{
            text:child,
            children:[]
          }
        }
      })
    }
  }


}


class Component{
  constructor(props){
    this.props=props
    // this.updateQueue=new UpdateQueue()

  }

  setState(payload){//可能是对象，也可能是一个函数
    let update=new Update(payload)
    // this.updateQueue.enqueueUpdate(update)
    // updateQueue其实是放在此类组件对应的fiber节点的 internalFiber
    this.internalFiber.updateQueue.enqueueUpdate(update)


    console.log(this.internalFiber,'this.internalFiber')
    scheduleRoot()//从根节点开始调度


  }
}

Component.prototype.isReactComponent={}//类组件
const React={
  createElement,
  useReducer,
  Component
}

export default React
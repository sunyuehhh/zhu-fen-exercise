import { REACT_TEXT } from "./constants";
import { REACT_COMPONENT } from "./constants"
import {addEvent} from './event'
/**
 * 把虚拟DOM变为真实DOM  插入父节点中
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom,container){
  let newDOM=createDOM(vdom)
  container.appendChild(newDOM)
}

function createDOM(vdom){
  let {type,props}=vdom
  // 根据不同的虚拟DOM的类型创建新的DOM
  let dom;
  if(type===REACT_TEXT){
    dom=document.createTextNode(props)
  }else if(typeof type==='function'){
    if(type.isReactComponent===REACT_COMPONENT){
      return mountClassComponent(vdom)
    }else{
    return mountFunctionComponent(vdom)
    }
  }else{
    dom=document.createElement(type)
  }
  if(props){
    updateProps(dom,{},props)
    if(props.children&&typeof props.children==='object'&&props.children.$$typeof){
      render(props.children,dom)
    }else if(Array.isArray(props.children)){
      reconcileChildren(props.children,dom)

    }
  }

  // 当我们根据虚拟DOM创建真实DDOM
  vdom.dom=dom
  return dom
}

function mountClassComponent(vdom){
  let {type,props}=vdom
  let classInstance=new type(props)
  let renderVdom=classInstance.render()
  // 把类组件渲染的虚拟DOM放到类的实例上
  classInstance.oldRenderVdom= vdom.oldRenderVdom= renderVdom
  return createDOM(renderVdom)
}

function mountFunctionComponent(vdom){
  let {type,props}=vdom
  let renderVdom=type(props)
  // 把函数组件渲染的虚拟DOM放在函数组件自己的虚拟dom上
  vdom.oldRenderVdom=renderVdom
  return createDOM(renderVdom)
}

function reconcileChildren(childrenVdom,parentDOM){
  for(let i=0;i<childrenVdom?.length;i++){
    render(childrenVdom[i],parentDOM)
  }
}


/**
 * 把新的属性同步到真实DOM上
 * @param {*} dom 
 * @param {*} oldProps 
 * @param {*} newProps 
 */
function updateProps(dom,oldProps={},newProps={}){
  for(const key in newProps){
    if(key==='children'){
      // 儿子属性会单独处理，并不会在这里处理
      continue
    }else if(key==='style'){
      let styleObj=newProps[key]
      for(let attr in styleObj){
        dom.style[attr]=styleObj[attr]
      }

    }else if (/^on[A-Z]/.test(key)) {
      // 事件处理（如 onClick、onChange）
      // const eventType = key.toLowerCase().slice(2); // onClick -> click
      // dom.addEventListener(eventType, newProps[key]);
      addEvent(dom,key.toLowerCase(),newProps[key])
    }else{
      // id  className
      dom[key]=newProps[key]
    }
  }

  for(const key in oldProps){
    if(!newProps.hasOwnProperty(key)){
      delete dom[key]
    }
  }

}
/**
 * 根据虚拟DOM获取真实DOM
 * @param {*} vdom 
 */
export function findDOM(vdom){
  if(!vdom) return null
  if(vdom.dom){
    return vdom.dom
  }else{
    let renderVdom=vdom.oldRenderVdom
    return findDOM(renderVdom)
  }

}


export function compareTwoVdom(parentDOM,oldVdom,newVdom){
  let oldDOM=findDOM(oldVdom);
  let newDOM=createDOM(newVdom)
  console.log(newDOM,newVdom,'&&&&&&&&&&&&&&&&&&&')
  parentDOM.replaceChild(newDOM,oldDOM)

}
const ReactDOM={
  render
}


export default ReactDOM
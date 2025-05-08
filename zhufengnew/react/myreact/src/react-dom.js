import { REACT_TEXT } from "./constants";
import { REACT_COMPONENT } from "./constants"
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
  return dom
}

function mountClassComponent(vdom){
  let {type,props}=vdom
  let renderVdom=new type(props).render()
  return createDOM(renderVdom)
}

function mountFunctionComponent(vdom){
  let {type,props}=vdom
  let renderVdom=type(props)
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
const ReactDOM={
  render
}


export default ReactDOM
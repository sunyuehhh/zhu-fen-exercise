import { REACT_FORWARD_REF, REACT_TEXT,REACT_FRAGMENT, MOVE, PLACEMENT, REACT_PROVIDER, REACT_CONTEXT } from "./constants";
import { REACT_COMPONENT } from "./constants"
import {addEvent} from './event'


let hookStates=[]
let hookIndex=0




/**
 * 把虚拟DOM变为真实DOM  插入父节点中
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom,container){
  let newDOM=createDOM(vdom)
  container.appendChild(newDOM)
  if(newDOM.componentDidMount){
    newDOM.componentDidMount()
  }
}

function createDOM(vdom){
  let {type,props,ref}=vdom
  // 根据不同的虚拟DOM的类型创建新的DOM
  let dom;
  if(type&&type.$$typeof===REACT_PROVIDER){
    return mountProviderComponent(vdom)

  }else if(type&&type.$$typeof===REACT_CONTEXT){
    return mountContextComponent(vdom)
  }
  else if(type&&type.$$typeof===REACT_FORWARD_REF){
    return mountForwardComponent(vdom)

  }else if(type===REACT_TEXT){
    dom=document.createTextNode(props)
  }else if(type===REACT_FRAGMENT){
    dom=document.createDocumentFragment()
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
  if(ref) {
    ref.current=dom
  }
  return dom
}
/**
 * 1.把属性中的值存放到Provider._currentValue上
 * 2.渲染它的子节点
 * @param {*} vdom 
 */
function mountProviderComponent(vdom){
  let {type,props}=vdom
  let context=type._context//Provider._context
  context._currentValue=props.value//Provider是赋值
  let renderVdom=props.children
  vdom.oldRenderVdom=renderVdom
  return createDOM(renderVdom)

}

function mountContextComponent(vdom){
  let {type,props}=vdom
  let context=type._context;//Consumer._context
  let renderVdom=props.children(context._currentValue);
  vdom.oldRenderVdom=renderVdom
  return createDOM(renderVdom)
}

function mountForwardComponent(vdom){
  let {type,props,ref}=vdom
  let renderVdom=type.render(props,ref)
  return createDOM(renderVdom)
}

function mountClassComponent(vdom){
  let {type,props,ref}=vdom
  let classInstance=new type(props)
  if(classInstance.contentType){
    classInstance.context=classInstance.contentType._currentValue
  }

  vdom.classInstance=classInstance
  // 组件将要挂载
  if(classInstance.UNSAFE_componentWillMount){
    classInstance.UNSAFE_componentWillMount()
  }
  if(ref) ref.current=classInstance;
  let renderVdom=classInstance.render()
  // 把类组件渲染的虚拟DOM放到类的实例上
  classInstance.oldRenderVdom= vdom.oldRenderVdom= renderVdom
  let dom=createDOM(renderVdom)
  // 
  if(classInstance.componentDidMount){
    dom.componentDidMount=classInstance.componentDidMount.bind(classInstance)
  }
  return dom
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
    if(vdom.classInstance){
      vdom=vdom.classInstance.oldRenderVdom
    }else{
      vdom=vdom.oldRenderVdom
    }
    // let renderVdom=vdom.oldRenderVdom
    return findDOM(vdom)
  }

}


export function compareTwoVdom(oldDOM,parentDOM,oldVdom,newVdom,nextDOM){
  if(!oldVdom&&!newVdom){
    return 
  }else if(oldVdom&&!newVdom){
    // 如果老节点存在，新节点不存在，需要直接删除老节点就可以了
    unMountVdom(oldVdom)
  }else if(!oldVdom&&newVdom){
    let newDOM=createDOM(newVdom)
    if(nextDOM){
      parentDOM.insertBefore(newDOM,nextDOM)
    }else{
      parentDOM.appendChild(newDOM)
    }
    parentDOM.appendChild(newDOM)
    if(newDOM.componentDidMount){
      newDOM.componentDidMount()
    }

  }else if(oldVdom&&newVdom&&oldVdom.type!==newVdom.type){
    unMountVdom(oldVdom)

    let newDOM=createDOM(newVdom)
    if(nextDOM){
      parentDOM.insertBefore(newDOM,nextDOM)
    }else{
      parentDOM.appendChild(newDOM)
    }
    if(newDOM.componentDidMount){
      newDOM.componentDidMount()
    }

  }else{
    // 如果老节点有值 并且新节点有值  并且类型相同
    updateElement(parentDOM,oldVdom,newVdom)
  }

  // let oldDOM=findDOM(oldVdom);
  // let newDOM=createDOM(newVdom)
  // console.log(newDOM,newVdom,'&&&&&&&&&&&&&&&&&&&')
  // parentDOM.replaceChild(newDOM,oldDOM)

}


/**
 * 对新老虚拟DOM节点进行深度对比
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(parentDOM,oldVdom,newVdom){
  if(oldVdom.type.$$typeof===REACT_CONTEXT){
    updateContextComponent(oldVdom,newVdom)

  }else if(oldVdom.type.$$typeof===REACT_PROVIDER){
    updateProviderComponent(oldVdom,newVdom)
  }else 
  if(oldVdom.type===REACT_TEXT){
    let currentDOM=newVdom.dom=findDOM(oldVdom)
    if(oldVdom.props!==newVdom.props){
      currentDOM.textContent=newVdom.props;
    }
  }else if(typeof oldVdom.type==='string'){
    let currentDOM=newVdom.dom=findDOM(oldVdom);
    updateProps(currentDOM,oldVdom.props,newVdom.props)
    updateChildren(currentDOM,oldVdom.props.children,newVdom.props.children)
  }else if(oldVdom.type === REACT_FRAGMENT){
    // 片段的时候
    updateChildren(parentDOM,oldVdom.props.children,newVdom.props.children)
  }else if(typeof oldVdom.type==='function'){
    if(oldVdom.type.isReactComponent){
      // 类组件
      updateClassComponent(oldVdom,newVdom)
    }else{
      updateFunctionComponent(oldVdom,newVdom)
    }

  }
}

function updateContextComponent(oldVdom,newVdom){
  let currentDOM=findDOM(oldVdom)
  let parentDOM=currentDOM.parentNode
  let {type,props}=newVdom
  let context=type._context
  let renderVdom=props.children(context._currentValue);
  compareTwoVdom(currentDOM,parentDOM,oldVdom.oldRenderVdom,renderVdom)
  newVdom.oldRenderVdom=renderVdom
}

function updateProviderComponent(oldVdom,newVdom){
  let currentDOM=findDOM(oldVdom)
  let parentDOM=currentDOM.parentNode
  let {type,props}=newVdom
  let context=type._context
  context._currentValue=props.value
  let renderVdom=props.children;
  compareTwoVdom(currentDOM,parentDOM,oldVdom.oldRenderVdom,renderVdom)
  newVdom.oldRenderVdom=renderVdom

}



function updateClassComponent(oldVdom,newVdom){
  const classInstance=newVdom.classInstance=oldVdom.classInstance
  if(classInstance.UNSAFE_componentWillReceiveProps){
    classInstance.UNSAFE_componentWillReceiveProps()
  }
  classInstance.updater.emitUpdate(newVdom.props)

}

function updateFunctionComponent(oldVdom,newVdom){
  let currentDOM=findDOM(oldVdom)
  if(!currentDOM) return
  let {type,props}=newVdom
  let newRenderVdom =type(props)
  compareTwoVdom(currentDOM,currentDOM.parentNode,oldVdom.oldRenderVdom,newRenderVdom)
  newVdom.oldRenderVdom=newRenderVdom

}
/**
 * 更新子节点
 * @param {*} parentDOM  父真实DOM 
 * @param {*} oldVChildren 老儿子虚拟DOM数组
 * @param {*} newVChildren 新儿子虚拟DOM数组
 */
function updateChildren(parentDOM,oldVChildren,newVChildren){
  oldVChildren=Array.isArray(oldVChildren)?oldVChildren:[oldVChildren]
  newVChildren=Array.isArray(newVChildren)?newVChildren:[newVChildren]
  // let maxLength=Math.max(oldVChildren.length,newVChildren.length)
  // for(let i=0;i<maxLength;i++){
  //   let nextVdom=oldVChildren.find((item,index)=>index>i&&item&&findDOM(item))
  //   compareTwoVdom(findDOM(oldVChildren[i]),parentDOM,oldVChildren[i],newVChildren[i],findDOM(nextVdom))
  // }
  // 1.创建一个map
  const keyedOldMap={}
  let lastPlaceIndex=0;
  oldVChildren.forEach((oldVChild,index)=>{
    let oldKey=oldVChild.key||index
    oldVChild.mountIndex=index
    keyedOldMap[oldKey]=oldVChild
  })
  // 2.创建一个DOM补丁包，收集DOM操作
  const patch=[]
  newVChildren?.forEach((newVChild,index)=>{
    newVChild.mountIndex=index
    let newKey=newVChild.key||index
    let oldVChild=keyedOldMap[newKey];
    if(oldVChild){
      // 可复用老节点
      updateElement(findDOM(oldVChild).parentNode,oldVChild,newVChild)
      if(oldVChild.mountIndex<lastPlaceIndex){
        patch.push({
          type:MOVE,
          oldVChild,
          newVChild,
          mountIndex:index,
        })

      }

      // 如果有一个老节点 被复用，就可以从map中删除
      delete keyedOldMap[newKey]
      lastPlaceIndex=Math.max(lastPlaceIndex,oldVChild.mountIndex)

    }else{
      // 找不到  添加
      patch.push({
        type:PLACEMENT,
        newVChild,
        mountIndex:index

      })
    }
  })
  // 先把要移动的和要删除的真实DOM节点全部删除
  let moveChildren=patch.filter(action=>action.type===MOVE).map(action=>action.oldVChild)
  Object.values(keyedOldMap).concat(moveChildren).forEach(oldVChild=>{
    let currentDOM=findDOM(oldVChild)
    currentDOM.remove()
  })

  patch.forEach(action=>{
    let {type,oldVChild,newVChild,mountIndex}=action
    // 老的真实DOM节点的集合
    let childNodes=parentDOM.childNodes;
    if(type===PLACEMENT){
      // 插入的话
      let newDOM=createDOM(newVChild)
      let childNode=childNodes[mountIndex]
      if(childNode){
        parentDOM.insertBefore(newDOM,childNode)
      }else{
        parentDOM.appendChild(newDOM)
      }
    }else if(type===MOVE){
      let oldDOM=findDOM(oldVChild)
      let childNode=childNodes[mountIndex]
      if(childNode){
        parentDOM.insertBefore(oldDOM,childNode)
      }else{
        parentDOM.appendChild(oldDOM)
      }
    }
  })

}

/**
 * 卸载老节点
 * @param {*} vdom 
 */
function unMountVdom(vdom){
  let {type,props,ref,classInstance}=vdom
  let currentDOM=findDOM(vdom)
  console.log('卸载',classInstance)
  if(classInstance&&classInstance.componentWillUnmount){
    classInstance.componentWillUnmount()
  }
  if(ref){
    ref.current=null
  }
  if(props.children){
    let children=Array.isArray(props.children)?props.children:[props.children]
    children.forEach(unMountVdom)
  }
  if(currentDOM) currentDOM.parentNode.removeChild(currentDOM)
}



export function useReducer(reducer,initialState){
  hookStates[hookIndex]=hookStates[hookIndex]||initialState
  const currentIndex=hookIndex

  function dispatch(action){
    let oldState=hookStates[currentIndex]

    hookStates[currentIndex]= reducer(oldState,action)

    // scheduleUpdate()  进行更新
  }

  return [hookStates[hookIndex++],dispatch]

}












const ReactDOM={
  render
}


export default ReactDOM
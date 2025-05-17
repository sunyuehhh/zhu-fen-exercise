import { ELEMENT_TEXT, TAG_HOST, TAG_ROOT, TAG_TEXT } from "./constants";
import { PLACEMENT } from "./constants";
import { setProps } from "./utils";

/**
 * 从根节点开始渲染和调度
 * 两个阶段：
 * diff阶段 对比新旧的虚拟DOM 进行增量 更新 和创建,render阶段
 * 这个阶段可能比较花时间，我们对仍无进行拆分，拆分的维度虚拟DOM,此阶段可以暂停
 * commit阶段:进行DOM更新创建阶段，此阶段不能暂停，要一气呵成
 */
let nextUnitOfWork=null//下一个工作单元
let workingInProgressRoot=null;//RootFiber应用的根
export function scheduleRoot(rootFiber){//{tag：TAG_ROOT,stateNode:container,props:[element]}
  workingInProgressRoot=rootFiber
  nextUnitOfWork=rootFiber
}

function performUnitOfWork(currentFiber){
  beginWork(currentFiber)//开始
  if(currentFiber.child){
    return currentFiber.child
  }
  while(currentFiber){
    completeUnitOfWork(currentFiber);//没有儿子让自己完成
    if(currentFiber.sibling){
      return currentFiber.sibling//有弟弟返回弟弟
    }
    currentFiber=currentFiber.return
  }
}

// 在完成的时候要收集有副作用的fiber  最后组成effect list
// 每个fiber有两个属性  firstEffect指向第一个有副作用的子fiber  lastEffect 指向最后一个有副作用子fiber
// 中间的用nextEffect做成一个单链表  firstEffect=大儿子  .nextEffect二儿子
function completeUnitOfWork(currentFiber){//都一个完成的是A1(TEXT)
  let returnFiber=currentFiber.return;//A1
  if(returnFiber){
    // 这一端是把自己儿子的effect 链挂到父亲身上
    if(!returnFiber.firstEffect){
      returnFiber.firstEffect=currentFiber.firstEffect
    }
    if(!!currentFiber.lastEffect){
      if(!!returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect=currentFiber.firstEffect
      }
        returnFiber.lastEffect=currentFiber.lastEffect
    }
    // 把自己挂到父亲 身上
    const effectTag=currentFiber.effectTag
    if(effectTag){//自己有副作用  A1 first  last=A1(Text)
      if(returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect=currentFiber
      }else{
        returnFiber.firstEffect=currentFiber
      }
      returnFiber.lastEffect=currentFiber
    }
  }



}

/**
 * beginWork 开始收下线的钱
 * completeUnitOfWork把下线的钱收完了
 * 1.创建真实DOM元素
 * 2.创建子fiber
 */
function beginWork(currentFiber){
  if(currentFiber.tag===TAG_ROOT){
    updateHostRoot(currentFiber)
  }else if(currentFiber.tag===TAG_TEXT){
    updateHostText(currentFiber)

  }else if(currentFiber.tag===TAG_HOST){
    updateHost(currentFiber)

  }

}

function updateHost(currentFiber){
  if(!currentFiber.stateNode){//如果此fiber没有创建DOM节点
    currentFiber.stateNode=createDOM(currentFiber)
  }
  const newChildren=currentFiber.props.children
  reconcileChildren(currentFiber,newChildren)
}

function createDOM(currentFiber){
  if(currentFiber.tag===TAG_TEXT){
    return document.createTextNode(currentFiber.props.text)
  }else if(currentFiber.tag===TAG_HOST){//span div
    let stateNode=document.createElement(currentFiber.type)
    updateDOM(stateNode,{},currentFiber.props)
    return stateNode
  }

}

function updateDOM(stateNode,oldProps,newProps){
  setProps(stateNode,oldProps,newProps)

}

function updateHostText(currentFiber){
  if(!currentFiber.stateNode){//如果此fiber没有创建DOM节点
    currentFiber.stateNode=createDOM(currentFiber)

  }

}

function updateHostRoot(currentFiber){//[A1]
  // 先处理自己 如果是一个原生节点  创建真实DOM 2.创建子fiber
  let newChildren=currentFiber.props.children;//[element]
  reconcileChildren(currentFiber,newChildren)
}


function reconcileChildren(currentFiber,newChildren){
  let newChildIndex=0;//新子节点的索引
  let prevSibling;//上一个新的子fiber
  // 遍历我们的子虚拟DOM元素数组，为每个虚拟DOM元素创建Fiber
  while(newChildIndex<newChildren?.length){
    let tag;
    let newChild=newChildren[newChildIndex];//取出虚拟DOM节点
    if(newChild.type===ELEMENT_TEXT){
      tag=TAG_TEXT;//这是一个文本节点

    }else if(typeof newChild.type==='string'){
      tag=TAG_HOST;//如果type是字符串 那么这是一个原生DOM节点

    }
    // beginWork创建fiber  在completeUnitOfWork的时候收集effect
    let newFiber={
      tag,//TAG_HOST
      type:newChild.type,//div
      props:newChild.props,
      stateNode:null,//div还没有创建DOM
      return:currentFiber,
      effectTag:PLACEMENT,//副作用标识  render我们会收集副作用  增加 删除  
      nextEffect:null,//effect list也是个单链表
      // effect list顺序和 完成顺序是一样的  但是节点只放那些出钱的人的fiber节点  不出钱的

    }
    // 最小的儿子是没有弟弟的
    if(newFiber){
      if(newChildIndex===0){//如果当前索引为0  说明这是太子
        currentFiber.child=newFiber
      }else{
        prevSibling.sibling=newFiber//让太子的弟弟指向二皇子

      }
    }

    prevSibling=newFiber
    newChildIndex++

  }

}



// 循环执行工作   nextUnitWork
function workLoop(deadline){
  let shouldYield=false;//是否要让出时间片或者控制权
  while(nextUnitOfWork&&!shouldYield){
    nextUnitOfWork=performUnitOfWork(nextUnitOfWork);//执行完一个任务后
    shouldYield=deadline.timeRemaining()<1;//没有时间的话 就让出控制权
  }
  if(!nextUnitOfWork&&workingInProgressRoot){//如果时间片到期后还有任务没有完成，就需要请求浏览器再次调度
    console.log('render阶段结束')
    commitRoot()
  }
  // 不管有没有任务  都请求再次调度  每一帧都要执行一次workLoop
  requestIdleCallback(workLoop,{timeout:500})

}


function commitRoot(){
  let currentFiber=workingInProgressRoot.firstEffect
  while(currentFiber){
    commitWork(currentFiber)
    currentFiber=currentFiber.nextEffect
  }
  workingInProgressRoot=null

}

function commitWork(currentFiber){
  console.log(currentFiber,'currentFiber')
  if(!currentFiber) return
  let returnFiber=currentFiber.return
  let returnDOM=returnFiber?.stateNode
  if(currentFiber.effectTag===PLACEMENT){
    returnDOM&&currentFiber.stateNode&&returnDOM?.appendChild(currentFiber.stateNode)
  }

  currentFiber.effectTag=null

}

// react告诉  浏览器  我现在有任务  请你再闲的时候
// 有个优先级的概念。expirationTime 
requestIdleCallback(workLoop,{
  timeout:500
})
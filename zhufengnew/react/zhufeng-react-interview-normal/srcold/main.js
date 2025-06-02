import React from "react";
let style={color:'green',border:'1px solid red',margin:'5px'}

// let virtualDOM=(
//   <div key="A" style={style}>A
//   <div key="B1" style={style}>B1</div>
//   <div key="B2" style={style}>B2</div>
//   </div>
// )
let A={
  type:'div',
  key:"A",
  props:{
    style,
    children:[
      {
        type:'div',key:'B1',props:{style,children:[]}
      },
      {
        type:'div',key:'B2',props:{style,children:[]}
      }
    ]
  }
}
// 开启我们的工作循环
// 表示一个工作单元  表示正在处理中的fiber
let workInProgress;
const TAG_ROOT="TAG_ROOT"//这个是Fiber根节点
const TAG_HOST="TAG_HOST"//指的是原生DOM节点  div span p

const Placement='Placement'

let root=document.getElementById('root')

function workLoop(){
  // deadline.timeRemaining()>1&&workInProgress
  while(workInProgress){//如果有任务就执行
    workInProgress=performUnitOfWork(workInProgress);//执行完成之后会返回下一个任务
  }

  console.log(rootFiber)

  commitRoot(rootFiber)
}

function commitRoot(rootFiber){
  let currentEffect=rootFiber.firstEffect
  while(currentEffect){
    let flags=currentEffect.flags
    switch(flags){
      case Placement:
        commitPlacement(currentEffect)
    }
    currentEffect=currentEffect.nextEffect
  }

}

function commitPlacement(currentEffect){
  let parent=currentEffect.return.stateNode;//父DOM节点
  parent.appendChild(currentEffect.stateNode)
  


}
// Fiber是一个普通的JS对象
let rootFiber={
  tag:TAG_ROOT,
  key:"ROOT",//唯一标签
  stateNode:root,//Fiber对应的真实DOM节点
  props:{
    children:[A]
  }
}

function performUnitOfWork(workInProgress){
  console.log(workInProgress.key)
  beginWork(workInProgress)
  if(workInProgress.child){
    return workInProgress.child
  }
  // 如果没有儿子 接着构建弟弟
  while(workInProgress){
    // 如果没有儿子  自己就结束了
    completeUnitOfWork(workInProgress)
    if(workInProgress.sibling){
      return workInProgress.sibling
    }
    // 如果也没有弟弟  找叔叔  找爸爸的弟弟
    workInProgress=workInProgress.return
    // 如果没有父亲  就全部结束了
  }

}

// Fiber节点在结束  创建真实的DOM元素
function completeUnitOfWork(workInProgress){
  console.log('completeUnitOfWork',workInProgress.key)
  let stateNode;//真实DOM
  switch(workInProgress.tag){
    case TAG_HOST:
      stateNode=createStateNode(workInProgress)
      break;
  
  }

  // 在完成工作的单元的时候要判断当前的fiber节点有没有对应的DOM操作
  makeEffectList(workInProgress)

}

function makeEffectList(completeWork){
  let returnFiber=completeWork.return
  if(returnFiber){
    if(!returnFiber.firstEffect){
      returnFiber.firstEffect=completeWork.firstEffect

    }
    if(completeWork.lastEffect){
      if(returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect=completeWork.firstEffect
      }
      returnFiber.lastEffect=completeWork.lastEffect
    }

    // 要插入自己
    if(completeWork.flags){
      if(returnFiber.lastEffect){
      returnFiber.lastEffect.nextEffect=completeWork
      }else{
        returnFiber.firstEffect=completeWork
      }
    }
    returnFiber.lastEffect=completeWork
  }
}

function createStateNode(fiber){
  if(fiber.tag===TAG_HOST){
    let stateNode=document.createElement(fiber.type)
    fiber.stateNode=stateNode
  }

  return fiber.stateNode

}
/**
 * 根据当前的Fiber和虚拟DOM构建Fiber树
 * @param {*} workInProgress 
 */
function beginWork(workInProgress){
  console.log('beginWork',workInProgress)
  let nextChildren=workInProgress.props.children
  // 会根据父FIBER和所有儿子虚拟DOM儿子们构建子fiber树  只有一层
  return reconcileChildren(workInProgress,nextChildren)
}

function reconcileChildren(returnFiber,nextChildren){
  let previousNewFiber;//上一个Fiber儿子
  let firstChildFiber=null;//当前returnFiber的大儿子
  for(let newIndex=0;newIndex<nextChildren.length;newIndex++){
    let newFiber=createFiber(nextChildren[newIndex])
    newFiber.flags=Placement;//这是个新节点 肯定要插入到DOM中
    newFiber.return=returnFiber
    if(!firstChildFiber){
      firstChildFiber=newFiber
    }else{
      previousNewFiber.sibling=newFiber
    }
    previousNewFiber=newFiber
  }
  returnFiber.child=firstChildFiber
  return firstChildFiber
}

function createFiber(element){
  return {
    tag:TAG_HOST,//原生DOM节点
    type:element.type,//具体  div p span
    key:element.key,
    props:element.props,

  }
}

workInProgress=rootFiber
workLoop()

// 开始根据虚拟DOM构建fiber树

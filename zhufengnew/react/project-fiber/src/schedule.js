import { DELETION, ELEMENT_TEXT, TAG_CLASS, TAG_HOST, TAG_ROOT, TAG_TEXT, UPDATE,TAG_FUNCTION_COMPONENT } from "./constants";
import { PLACEMENT } from "./constants";
import { Update, UpdateQueue } from "./UpdateQueue";
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
let currentRoot=null;//渲染成功之后当前根ROOTFiber
let deletions=[];//删除的节点我们并北部放在effect list里,所以需要单独记录并执行
let workingInProgressFiber=null;//正在工作中的fiber
let hookIndex=0;//hooks索引
export function scheduleRoot(rootFiber){//{tag：TAG_ROOT,stateNode:container,props:[element]}
  if(currentRoot&&currentRoot.alternate){
    workingInProgressRoot=currentRoot.alternate;//第一次渲染出来的fiber tree
    workingInProgressRoot.alternate=currentRoot;//让这个树的替身执向的当前的currentRoot

    if(rootFiber) workingInProgressRoot.props=rootFiber.props;//让它的props更新成新的props

  }
  else if(currentRoot){//说明至少已经渲染过一次了
    if(rootFiber){
      rootFiber.alternate=currentRoot
      workingInProgressRoot=rootFiber
    }else{
      workingInProgressRoot={
        ...currentRoot,
        alternate:currentRoot
      }
    }

  }else{
    // 第一次渲染
    workingInProgressRoot=rootFiber
  }

  console.log('scheduleRoot')
  workingInProgressRoot.firstEffect=workingInProgressRoot.lastEffect=workingInProgressRoot.nextEffect=null
  nextUnitOfWork=workingInProgressRoot
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
  console.log('beginWork',currentFiber.tag)
  if(currentFiber.tag===TAG_ROOT){//根fiber
    updateHostRoot(currentFiber)
  }else if(currentFiber.tag===TAG_TEXT){//文本fiber
    updateHostText(currentFiber)

  }else if(currentFiber.tag===TAG_HOST){//原生DOM节点  stateNode dom
    updateHost(currentFiber)

  }else if(currentFiber.tag===TAG_CLASS){//类组件
    updateClassComponent(currentFiber)

  }else if(currentFiber.tag===TAG_FUNCTION_COMPONENT){//函数组件
      updateFunctionComponent(currentFiber)
  }

}

function updateFunctionComponent(currentFiber){
  console.log('更新函数组件')
  workingInProgressFiber=currentFiber
  hookIndex=0
  workingInProgressFiber.hooks=[]
  let newChildren=currentFiber.type(currentFiber.props)
  reconcileChildren(currentFiber,[newChildren])

}

function updateClassComponent(currentFiber){
  console.log('更新类组件')
  if(!currentFiber.stateNode){//类组件  stateNode  组件实例
    // new ClassCounter()  类组件实例   finer双向指向
    currentFiber.stateNode=new currentFiber.type(currentFiber.props)
    currentFiber.stateNode.internalFiber=currentFiber
    currentFiber.updateQueue=new UpdateQueue()

  }
  // 给组件的实例state  赋值
  console.log(currentFiber,'currentFiber')
  currentFiber.stateNode.state=currentFiber.updateQueue.forceUpdate(currentFiber.stateNode.state)
  console.log(currentFiber.stateNode.state,'state')
  let newElement=currentFiber.stateNode.render()
  const newChildren=[newElement]

  reconcileChildren(currentFiber,newChildren)


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
  if(stateNode?.setAttribute)
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
  // 如果说currentFibre有alternate并且alternate有child属性
  let oldFiber=currentFiber.alternate&&currentFiber.alternate.child;
  oldFiber&&(oldFiber.firstEffect=oldFiber.lastEffect=oldFiber.nextEffect=null);

  console.log(oldFiber,'oldFiber')

  let prevSibling;//上一个新的子fiber
  // 遍历我们的子虚拟DOM元素数组，为每个虚拟DOM元素创建Fiber
  while(newChildIndex<newChildren?.length||oldFiber){
    let tag;
    let newChild=newChildren[newChildIndex];//取出虚拟DOM节点
    let newFiber;//新的FIber
    const sameType=oldFiber&&newChild&&oldFiber.type===newChild.type


    if(newChild&&newChild?.type?.prototype?.isReactComponent){
      tag=TAG_CLASS;
    }else if(newChild&&typeof newChild.type==='function'){
      tag=TAG_FUNCTION_COMPONENT

    }else if(newChild&&newChild.type===ELEMENT_TEXT){
      tag=TAG_TEXT;//这是一个文本节点

    }else if(newChild&&typeof newChild.type==='string'){
      tag=TAG_HOST;//如果type是字符串 那么这是一个原生DOM节点

    }
    // beginWork创建fiber  在completeUnitOfWork的时候收集effect
    if(sameType){//说明老fiber和新虚拟DOM类型一样，可以复用老的DOM节点，更新即可
      if(oldFiber.alternate){//说明至少已经更新一次
        newFiber=oldFiber.alternate//如果有上上次的fiber 就拿来做i为这一次的fiber
        newFiber.props=newChild.props
        newFiber.alternate=oldFiber
        newFiber.effectTag=UPDATE
        newFiber.updateQueue=oldFiber.updateQueue||new UpdateQueue()
        newFiber.nextEffect=null

      }else{
      newFiber={
        tag:oldFiber.tag,//TAG_HOST
        type:oldFiber.type,//div
        props:newChild.props,
        stateNode:oldFiber.stateNode,//div还没有创建DOM
        return:currentFiber,
        updateQueue:oldFiber.updateQueue||new UpdateQueue(),
        alternate:oldFiber,//让新的fiber的alternate执行老的fiber
        effectTag:UPDATE,//副作用标识  render我们会收集副作用  增加 删除  
      
        nextEffect:null,//effect list也是个单链表
      }
    }
    }else{
      if(newChild){//看看新的虚拟DOM是不是为null
        newFiber={
          tag,//TAG_HOST
          type:newChild.type,//div
          props:newChild.props,
          stateNode:null,//div还没有创建DOM
          return:currentFiber,
          effectTag:PLACEMENT,//副作用标识  render我们会收集副作用  增加 删除  
          updateQueue:new UpdateQueue(),
          nextEffect:null,//effect list也是个单链表
          // effect list顺序和 完成顺序是一样的  但是节点只放那些出钱的人的fiber节点  不出钱的
    
        }
      }

      if(oldFiber){
        oldFiber.effectTag=DELETION
        deletions.push(oldFiber)
      }
  }

    if(oldFiber){
      oldFiber=oldFiber.sibling;//oldFiber指针往后移动一次
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
  deletions.forEach(commitWork);//执行effect list之前 先把该删的元素删掉
  console.log('commitRoot',workingInProgressRoot,)
  let currentFiber=workingInProgressRoot.child.firstEffect
  while(currentFiber){
    commitWork(currentFiber)
    currentFiber=currentFiber.nextEffect
  }
  deletions.length=0;//提交之后要清空deletion数据
  currentRoot=workingInProgressRoot;//把当前渲染成功的根fiber  赋给currentRoot
  console.log(currentRoot,'currentRoot')
  workingInProgressRoot=null




}

function commitWork(currentFiber){
  console.log(currentFiber,'currentFiber commitWork')
  if(!currentFiber) return
  let returnFiber=currentFiber.return
  while(returnFiber.tag!==TAG_HOST&&returnFiber.tag!==TAG_ROOT&&returnFiber.tag!==TAG_TEXT){
    // 不是dom节点的话
    returnFiber=returnFiber.return
  }
  let domReturn=returnFiber?.stateNode
  if(currentFiber.effectTag===PLACEMENT){//新增的节点
    let nextFiber=currentFiber;
    if(currentFiber.tag===TAG_CLASS){
      return
    }
    // 如果要挂载的节点不是DOM节点 比如说是类组件Fiber,一致找第一个儿子，知道找到一个真DOM节点为止
    while(nextFiber.tag!==TAG_HOST&&nextFiber.tag!==TAG_TEXT){
      nextFiber=currentFiber.child
    }
    domReturn?.appendChild(nextFiber.stateNode)
  }else if(currentFiber.effectTag===DELETION){//删除节点
    return commitDeletion(currentFiber,domReturn)
    // domReturn.removeChild(currentFiber.stateNode);

  }else if(currentFiber.effectTag===UPDATE){
    if(currentFiber.type===ELEMENT_TEXT){
      if(currentFiber.alternate.props.text!==currentFiber.props.text){
      currentFiber.stateNode.textContent=currentFiber.props.text;
      }
    }else{
      if(currentFiber.type===TAG_CLASS){
        return
      }
      updateDOM(currentFiber.stateNode,currentFiber.alternate.props,currentFiber.props)
    }

  }

  currentFiber.effectTag=null

}


function commitDeletion(currentFiber,domReturn){
  if(currentFiber.tag===TAG_HOST||currentFiber.tag===TAG_TEXT){
    domReturn.removeChild(currentFiber.stateNode)
  }else{
    commitDeletion(currentFiber.child,domReturn)
  }
}


export function useReducer(reducer,initialValue){
let newHook=workingInProgressFiber?.alternate?.hooks?.[hookIndex]
if(newHook){
  newHook.state=newHook.updateQueue.forceUpdate(newHook.state)
}else{
  newHook={
    state:initialValue,
    updateQueue:new UpdateQueue()
  }
}

const dispatch=action=>{
  let payload=reducer? reducer(newHook.state,action):action
  newHook.updateQueue.enqueueUpdate(new Update(payload))
  scheduleRoot()
}
workingInProgressFiber.hooks[hookIndex++]=newHook


return [newHook.state,dispatch]
}
// react告诉  浏览器  我现在有任务  请你再闲的时候
// 有个优先级的概念。expirationTime 
requestIdleCallback(workLoop,{
  timeout:500
})



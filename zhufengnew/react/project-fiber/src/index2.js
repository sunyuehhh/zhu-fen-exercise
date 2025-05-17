import element from "./element";
let container = document.getElementById("root");

export const PLACEMENT='PLACEMENT'

//下一个工作单元
// fiber其实也是一个普通的JS对象
let workingInProgressRoot = {
  stateNode: container, //此fiber对应的DOM节点
  props: {
    children: [element], //fiber的属性
  },
  //   child,
  //   fibling,
  //   return
};

let nextUnitOfWork=workingInProgressRoot

function workLoop() {
  // 如果有当前的工作单元，就执行它，并返回一个工作单元
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitIfWork(nextUnitOfWork);
  }
  if(!nextUnitOfWork){
    // 提交了
    commitRoot()
  }
}


function commitRoot(){
  let currentFiber=workingInProgressRoot.firstEffect;
  while(currentFiber){
    console.log('commitRoot',currentFiber.props.id)
    if(currentFiber.effectTag==='PLACEMENT'){
      currentFiber.return.stateNode.appendChild(currentFiber.stateNode)
    }
    currentFiber=currentFiber.nextEffect;
  }

  workingInProgressRoot=null




}
/**
 * beginWork  1.创建此fiber的真实DOM   通过虚拟DOM创建fiber树结构
 * @param {*} workingInProgressFiber
 */
function performUnitIfWork(workingInProgressFiber) {
  // 1.创建真实DOM  并没有挂载  2.创建fiber子树
  beginWork(workingInProgressFiber);
  if (workingInProgressFiber.child) {
    return workingInProgressFiber.child; //如果有儿子 返回儿子
  }

  while (workingInProgressFiber) {
    // 如果没有儿子  当前节点起始就结束完成了
    completeUnitOfWork(workingInProgressFiber);
    if (workingInProgressFiber.sibling) {
      return workingInProgressFiber.sibling; //如果有弟弟  返回弟弟
    }
    workingInProgressFiber = workingInProgressFiber.return; //先指向它的父亲
  }
}

// 先看有没儿子  有儿子先找儿子  然后看有没弟弟，有弟弟找弟弟，没有弟弟找父亲的弟弟就是叔叔
function beginWork(workingInProgressFiber){
  console.log('beginWork',workingInProgressFiber.props.id)
  if(!workingInProgressFiber.stateNode){
    workingInProgressFiber.stateNode=document.createElement(workingInProgressFiber.type);
    for(let key in workingInProgressFiber.props){
      if(key!=='children'){
        workingInProgressFiber.stateNode[key]=workingInProgressFiber.props[key]
      }

    }
  }//在beginWork里是不会挂载的
  // 创建子fiber
  let previousFiber;
  // children是一个虚拟DOM的数组
  workingInProgressFiber?.props?.children?.forEach((child,index) => {
    let childFiber={
      type:child.type,
      props:child.props,
      return:workingInProgressFiber,
      effectTag:'PLACEMENT',//这个fiber对应的DOM节点需要被插入到页中去   父DOM中
      nextEffect:null//下一个有副作用的节点
    }

    if(index===0){
      // 大儿子
      workingInProgressFiber.child=childFiber

    }else{
      previousFiber.sibling=childFiber

    }

    previousFiber=childFiber

    
  });
  

}
function completeUnitOfWork(workingInProgressFiber){
  console.log(workingInProgressFiber.props.id,'#########')
  // 构建副作用域effectList  只有那些有副作用的节点
  let returnFiber=workingInProgressFiber.return;//A1
  if(returnFiber){
    // 把当前fiber的有副作用子链表挂载到父亲身上
    if(!returnFiber.firstEffect){
      returnFiber.firstEffect=workingInProgressFiber.firstEffect
    }
    if(workingInProgressFiber.lastEffect){
      if(returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect=workingInProgressFiber.firstEffect
      }
      returnFiber.lastEffect=workingInProgressFiber.lastEffect
    }
    // 再把自己挂载后面
    if(workingInProgressFiber.effectTag){
      if(returnFiber.lastEffect){
        returnFiber.lastEffect.nextEffect=workingInProgressFiber
      }else{
        returnFiber.firstEffect=workingInProgressFiber
      }
      returnFiber.lastEffect=workingInProgressFiber
    }
  }

}

//告诉浏览器空闲时间执行workLoop
requestIdleCallback(workLoop);

import { FunctionComponent, HostComponent, IndeterminateComponent } from "./ReactWorkTags";
import { renderWithHook } from "./ReactFiberHooks";

/**
 * 
 * @param {*} current 上一个fiber  初次挂载的时候是null
 * @param {*} workInProgress  这一次正在构建中的fiber
 */
function beginWork(current,workInProgress){
  switch(workInProgress.tag){
    case IndeterminateComponent:
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type  //Counter组件
      )
    default:
      break
  }

}


function mountIndeterminateComponent(current,workInProgress,Component){
  // value就是Counter组件函数的返回值
  let children=renderWithHook(
    current,
    workInProgress,
    Component
  )

  console.log(children,'children')

  window.counter=children

  workInProgress.tag=FunctionComponent
  // 根据儿子的或者上面返回的虚拟DOM  构建Fiber子树
  reconcileChildren(null,workInProgress,children)

  return workInProgress.child



}

function reconcileChildren(current,workInProgress,children){
  let childFiber={
    tag:HostComponent,
    type:children.type
  }

  workInProgress.child=childFiber
  

}
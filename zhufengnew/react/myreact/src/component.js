import { REACT_COMPONENT } from "./constants"
import { findDOM ,compareTwoVdom} from "./react-dom"
export const updateQueue={
  isBatchingUpdate:false,//当前是否处于批量更新模式
  updates:new Set(),//当前更新队列中保存的所有的updaters实例，每个updater都对应一个组件
  batchUpdate(){//批量更新的方法
    updateQueue.isBatchingUpdate=false
    for(const updater of updateQueue.updates){
      updater.updateComponent() 
    }
    updateQueue.updates.clear()

  }
}
class Updater{
  constructor(classInstance){
    this.classInstance=classInstance
    this.pendingState=[]

  }

  addState(partialState){
    this.pendingState.push(partialState)
    this.emitUpdate()
  }

  emitUpdate(){
    if(updateQueue.isBatchingUpdate){
      // 如果但其概念处于批量更新模式，只添加updater实例到队列中，并不会
      updateQueue.updates.add(this)
    }else{
    this.updateComponent()
    }
  }

  // 1.计算新的组件状态 2.重新执行组件的render方法到新的虚拟DOM 3.把新的虚拟DOM同步到真实DOM上
  updateComponent(){
    const {classInstance,pendingState}=this
    // 如果长度大于0,说明有等待生效的更新
    if(pendingState.length>0){
      // 1.计算新的组件状态
      let newState=this.getState()
      shouldUpdate(classInstance,newState)

    }




  }
  

  getState(){
    const {classInstance,pendingState}=this
    // 获取老的状态
    let {state}=classInstance
    pendingState.forEach(nextState=>{
      state={...state,...nextState}
    })

    pendingState.length=0
    return state
  }
}

function shouldUpdate(classInstance,newState){
  classInstance.state=newState
  classInstance.forceUpdate()
}
export class Component{
  static isReactComponent=REACT_COMPONENT
  constructor(props){
    this.props=props
    this.updater=new Updater(this)
  }

  setState(partialState){
    this.updater.addState(partialState)

  }
  forceUpdate(){
    console.log('强制更新')
    let oldRenderVdom=this.oldRenderVdom
    let oldDOM=findDOM(oldRenderVdom)
    let newRenderVdom=this.render();
    compareTwoVdom(oldDOM.parentNode,oldRenderVdom,newRenderVdom)
    this.oldRenderVdom=newRenderVdom
  }
}





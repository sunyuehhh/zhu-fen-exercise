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
    this.callbacks=[]

  }

  addState(partialState,callback){
    this.pendingState.push(partialState)
    if(callback){
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }

  emitUpdate(nextProps){
    this.nextProps=nextProps
    updateQueue.updates.add(this)
    queueMicrotask(updateQueue.batchUpdate)
    // if(updateQueue.isBatchingUpdate){
    //   // 如果但其概念处于批量更新模式，只添加updater实例到队列中，并不会
    //   updateQueue.updates.add(this)
    // }else{
    // this.updateComponent()
    // }
  }

  // 1.计算新的组件状态 2.重新执行组件的render方法到新的虚拟DOM 3.把新的虚拟DOM同步到真实DOM上
  updateComponent(){
    const {classInstance,pendingState,nextProps,callbacks}=this
    // 如果长度大于0,说明有等待生效的更新
    // 如果有新的属性 或者说有新的状态进行更新
    if(nextProps||pendingState.length>0){
      // 1.计算新的组件状态
      let newState=this.getState()
      shouldUpdate(classInstance,nextProps, newState)

    }

    queueMicrotask(()=>{
      callbacks.forEach(callback=>callback())
      callbacks.length=0
    })




  }
  

  getState(){
    const {classInstance,pendingState}=this
    // 获取老的状态
    let {state}=classInstance
    pendingState.forEach(nextState=>{
      if(typeof nextState==='function'){
        nextState=nextState(state)
      }
      state={...state,...nextState}
    })

    pendingState.length=0
    return state
  }
}

function shouldUpdate(classInstance,nextProps,newState){
  // 表示是否要更新
  let willUpdate=true
  // 有方法并且执行结果为false 才表示不需要更新
  // 现在我们还没有处理属性的更新
  if(classInstance.shouldComponentUpdate&&!classInstance.shouldComponentUpdate(nextProps,newState)){
    willUpdate=false
  }
  if(willUpdate&&classInstance.UNSAFE_componentWillUpdate){
    classInstance.UNSAFE_componentWillUpdate()
  }
  if(nextProps){
    classInstance.props=nextProps
  }
  // 不管要不要更新，类的实例的state都会改变，都会指定新的状态
  classInstance.state=newState
  if(willUpdate){
  classInstance.forceUpdate()
  }
}
export class Component{
  static isReactComponent=REACT_COMPONENT
  constructor(props){
    this.props=props
    this.updater=new Updater(this)
  }

  setState(partialState,callback){
    this.updater.addState(partialState,callback)

  }
  forceUpdate(){
    console.log('强制更新')
    let oldRenderVdom=this.oldRenderVdom
    let oldDOM=findDOM(oldRenderVdom)
    console.log(this,'this')
    if(this.constructor.contextType){
      console.log(this.constructor,'*********')
      this.context=this.constructor.contextType._currentValue;
    }
    if(this.constructor.getDerivedStateFromProps){
      let newState=this.constructor.getDerivedStateFromProps(this.props,this.state)
      if(newState){
        this.state={
          ...this.state,...newState
        }
      }

    }
    let snapShot=this?.getSnapshotBeforeUpdate?.()
    let newRenderVdom=this.render();
    compareTwoVdom(oldDOM,oldDOM.parentNode,oldRenderVdom,newRenderVdom)
    this.oldRenderVdom=newRenderVdom
    if(this.componentDidUpdate){
      this.componentDidUpdate(this.props,this.state,snapShot)
    }
  }
}





import { ClassComponent, HostRoot } from "./ReactWorkTags"
import { SyncLane } from "./ReactFiberLane"


// Legacy模式同步模式  create稳定版默认就是这种模式
export const NoMode=0b000000
// 并发模式  开发版
export const ConcurrentMode=0b000001

var SyncLanePriority=12
var NoLanePriority=0
let syncQueue=[]

let NoContext=0
let BatchedContext=1;
let executionContext=NoContext;//执行环境  默认值是NoContext  非批量
export function scheduleUpdateOnFiber(fiber){
  // 向上找到根节点
  let root=markUpdateLaneFromFiberToRoot(fiber)
  // 开始创建一个任务  从根节点开始进行更新
  ensureRootIsScheduled(root)

  // 如果当前的执行上下文环境是NoContext(非批量)并且
  if(executionContext===NoContext&&(fiber.mode&ConcurrentMode)===NoMode){
    flushSyncCallbackQueue()

  }
}

// ReactDOM.unstable_batchUpdate
export function batchedUpdates(fn){
  let prevExecutionContext=executionContext
  executionContext|=BatchedContext
  fn()
  executionContext=prevExecutionContext
  
}

function ensureRootIsScheduled(root){
  let nextLanes=SyncLane
  let newCallbackPriority=SyncLanePriority;//按理说应该等于最高级别赛道的优先级  12
  var existingCallbackPriority=root.callbackPriority;//当前跟几点上正在执行的更新任务的优先级
  if(existingCallbackPriority===newCallbackPriority){
    // 也是在并发模式  即使在setTimeout里也是批量的原因
    return;//如果这个新的更新和当前根节点的已经调度的更新相等，那就直接返回，复用上次的更新，不再创建新的更新
  }

  scheduleSyncCallback(performSyncWorkOnRoot.bind(null,root))
  queueMicrotask(flushSyncCallbackQueue)
  root.callbackPriority=newCallbackPriority


}

function flushSyncCallbackQueue(){
  syncQueue.forEach(cb=>cb())
  syncQueue.length=0
}

// 其实就是把performSyncWorkOnRoot函数添加一个队列里  等待执行
function scheduleSyncCallback(callback){
  syncQueue.push(callback)


}

// 这个其实就是我们真正的渲染任务了  比较老的节点和新的节点  得到domdiff结果  更新DOM 都是这个方法里
function performSyncWorkOnRoot(workInProgress){
  let root=workInProgress
  while(workInProgress){
    console.log('开始执行调合任务')
    if(workInProgress.tag===ClassComponent){
      let inst=workInProgress.stateNode;//获取次fiber对应的类组件的实例
      inst.state=processUpdateQueue(inst,workInProgress)

      inst.render();//得到新状态后，就恶意调用render方法得到新的虚拟dom  进行domdiff
    }

    workInProgress=workInProgress.child
  }

  commitRoot(root)
}


function commitRoot(root){
  root.callbackPriority=NoLanePriority

}

// 根据老状态和我们的更新队列  计算我们的新状态
function processUpdateQueue(inst,fiber){
 return fiber.updateQueue.reduce((state,{payload})=>{
    if(typeof payload==='function'){
      payload=payload(state)
    }
    return {
      ...state,
      ...payload
    }

  },inst.state)


}

function markUpdateLaneFromFiberToRoot(fiber){
  let parent=fiber.return
  while(parent){
    fiber=parent
    parent=parent.return
  }

  if(fiber.tag===HostRoot){
    return fiber
  }

  return null

}
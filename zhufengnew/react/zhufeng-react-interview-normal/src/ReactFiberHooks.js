

const ReactCurrentDispatcher={
  current:null
}
let workInProgressHook=null
let currentlyRenderingFiber;//当前正在使用的fiber
const HookDispatcherOnMount={
  userReducer:mountReducer
}

export function useReducer(reducer,initialArg){
  ReactCurrentDispatcher.current.useReducer(reducer,initialArg)
}

// 不同的阶段useReducer有不同的实现
export function renderWithHook(current,workInProgress,Component){
  ReactCurrentDispatcher.current=HookDispatcherOnMount;
  currentlyRenderingFiber=workInProgress
  let children=Component()//Counter组件的渲染方法
  currentlyRenderingFiber=null
  workInProgressHook=null
  return children
}

function mountReducer(reducer,initialArg){
  // 构建hooks单向链表
  let hook=mountWorkInProgressHook()
  hook.memoizedState=initialArg
  const queue=(hook.queue={
    pending:null
  })//更新队列

  const dispatch=dispatchAction.bind(null,currentlyRenderingFiber,queue)

  return [hook.memoizedState,dispatch]
}

function dispatchAction(currentlyRenderingFiber,queue,action){
  const update={
    action,
    next:null
  }
  const pending=queue.pending
  if(pending=null){
    queue.next=update
  }else{
    queue.next=pending.next
    pending.next=update
  }

  queue.pending=update
  console.log('queue.pending',queue.pending)

}


function mountWorkInProgressHook(){
  let hook={//先创建一个hook对象
    memoizedState:null,//自己的状态
    queue:null,//自己的更新队列  环形链表
    next:null,//下一个更新
  }

  // 说明这是我们的第一个hook
  if(workInProgressHook===null){
    currentlyRenderingFiber.memoizedState=workInProgressHook=hook

  }else{
    workInProgressHook=workInProgressHook.next=hook
  }

  return workInProgressHook
}
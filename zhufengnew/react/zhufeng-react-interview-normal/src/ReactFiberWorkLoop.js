let workInProgress=null
// 正常来来说我们需要从根界限一直向下构建   Counter
export function render(fiber){
  workInProgress=fiber
  workLoop()



}

function performUnitOgWork(unitOfWork){
  let current=unitOfWork.alternate
  return beginWork(current,unitOfWork)

}



function workLoop(){
  while(workInProgress!==null){
    workInProgress= performUnitOgWork(workInProgress)
  }

}

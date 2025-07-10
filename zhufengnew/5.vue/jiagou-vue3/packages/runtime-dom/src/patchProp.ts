import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchEvent } from './modules/event'
import { patchAttr } from './modules/attr'


export function patchProp(el,key,prevVal,nextVal){
  // 根据preVal 和 nextVal 做diff来更新
  // {color:red} {background:red}

  if(key==='class'){
    patchClass(el,nextVal)
  }else if(key==='style'){
    // 如何比较两个对象的差异呢？
    patchStyle(el,prevVal,nextVal)

  }else if(/^on[^a-z]/.test(key)){
    patchEvent(el,key,nextVal)

  }else{
    patchAttr(el,key,nextVal)
  }
}


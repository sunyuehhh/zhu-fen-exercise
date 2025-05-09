import { REACT_ElEMENT,REACT_FORWARD_REF } from "./constants"
import { toVdom } from "./utils"
import { Component } from "./component"
function createElement(type,config,children){
  let ref;
  let key;
  if(config){
    ref=config.ref//通过它可以获取此真实DOM元素
    key=config.key//后面会用于DOMDIFF移动元素的处理
    delete config._source
    delete config._self
    delete config.ref
    delete config.key
  }
  let props={
    ...config
  }
  if(arguments.length>3){
    props.children=Array.prototype.slice.call(arguments,2).map(toVdom);
  }else if(arguments.length===3){
    props.children=toVdom(children)
  }

  console.log('createElement',{
    $$typeof:REACT_ElEMENT,
    type,
    props
  })

  return {
    $$typeof:REACT_ElEMENT,
    type,
    props,
    ref,
    key
  }
}

function createRef(){
  return {
    current:null
  }
}


function forwardRef(render){
  return {
    $$typeof:REACT_FORWARD_REF,
    render
  }
}


const React={
  createElement,
  Component,
  createRef,
  forwardRef
}

export default React
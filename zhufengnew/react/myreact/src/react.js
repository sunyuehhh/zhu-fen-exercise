import { REACT_ElEMENT } from "./constants"
import { toVdom } from "./utils"
function createElement(type,config,children){
  if(config){
    delete config._source
    delete config._self
  }
  let props={
    ...config
  }
  if(arguments.length>3){
    props.children=Array.prototype.slice.call(arguments,2).map(toVdom);
  }else if(arguments.length===3){
    props.children=toVdom(children)
  }

  return {
    $$typeof:REACT_ElEMENT,
    type,
    props
  }
}


const React={
  createElement
}

export default React
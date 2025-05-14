import { REACT_TEXT } from "./constants";
export function toVdom(element){
  return typeof element==='string'||typeof element==='number'?{
    $$typeof:REACT_TEXT,
    type:REACT_TEXT,
    props:element
  }:element

}


/**
 * 
 */
export function shallowEqual(obj1,obj2){
  if(obj1===obj2){
    return true
  }
  if(typeof obj1!=='object'||obj1===null||typeof obj2!=='object'||obj2===null){
    return false
  }
  let keys1=Object.keys(obj1)
  let keys2=Object.keys(obj2)
  if(keys1.length!==keys2.length){
    return false
  }
  for(let key in keys1){
    if(!obj1.hasOwnProperty(key)||obj1[key]!==obj2[key]){
      return false
    }
  }

  return true

}
import { REACT_TEXT } from "./constants";
export function toVdom(element){
  return typeof element==='string'||typeof element==='number'?{
    $$typeof:REACT_TEXT,
    type:REACT_TEXT,
    props:element
  }:element

}
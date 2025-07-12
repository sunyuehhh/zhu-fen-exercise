import { NodeTypes } from './ast';

export const TO_DISPLAY_STRING=Symbol('toDisplayString');//宏
export const CREATE_TEXT=Symbol('createTextVNode')
export const CREATE_ELEMENT_VNODE=Symbol('createElementVNode')

export const OPEN_BLOCK=Symbol('openBlock')
export const CREATE_ELEMENT_BLOCK=Symbol('createElementBlock')

export const FRAGMENT=Symbol('fragment')

export const helpNameMap={
  [TO_DISPLAY_STRING]:'toDisplayString',
  [CREATE_TEXT]:'createTextVNode',
  [CREATE_ELEMENT_VNODE]:'createElementVNode',
  [OPEN_BLOCK]:'openBlock',
  [CREATE_ELEMENT_BLOCK]:'createElementBlock',
  [FRAGMENT]:'fragment'
  
}

// 枚举本质就是对象

export function createCallExpression(context,args){
  context.helper(CREATE_TEXT)
  return {
    type:NodeTypes.JS_CALL_EXPRESSION,
    arguments:args
  }
}


export function createVNodeCall(context,tag,props,children){
  context.helper(CREATE_ELEMENT_VNODE)

  return {
    type:NodeTypes.VNODE_CALL,//createElementVNode()
    tag,
    props,
    children
  }

}


export function createObjectExpression(properties){
  return {
    type:NodeTypes.JS_OBJECT_EXPRESSION,
    properties
  }
}
// 用来耦合所有的 dom api

import { nodeOps } from './nodeOps';
import { patchProp } from './patchProp';
import { createRenderer as renderer } from '@vue/runtime-core';


const renderOptions=Object.assign(nodeOps,{
  patchProp
})



// 用户自己创建渲染器  把属性传递进行
export function createRenderer(renderOptions){
  return renderer(renderOptions)

}



export function render(vnode,container){
  // 内置渲染器 会自动传入domAPI 专门给vue来服务的
  const renderer=createRenderer(renderOptions)
  return renderer.render(vnode,container)
}



// 再次进行拆分
export * from '@vue/runtime-core'
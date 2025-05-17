export const vdom={"type":"div","key":null,"props":{"id":"A1","children":[{"type":"div","key":null,"props":{"id":"A1","children":[{"type":"div","key":null,"props":{"id":"C1"},"_owner":null,"_store":{}},{"type":"div","key":null,"props":{"id":"C2"},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}},{"type":"div","key":null,"props":{"id":"B2"},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}



// 如果节点多  层级特别深
// 因为JS是单线程的  而且UI渲染和JS执行是互斥的
/**
 * 
 * @param {*} element 虚拟DOM
 * @param {*} parentDOM 真实父DOM
 */
function render(element,parentDOM){
  let dom=document.createElement(element.type);
  // 处理属性
  Object.keys(element.props)
  .filter(key=>key!=='children')
  .forEach(key=>{
    dom[key]=element.props[key]
  })

  if(Array.isArray(element.props.children)){
    // 把每个子虚拟DOM变成真实DOM插入父DOM节点里
    element.props.children.forEach(child=>render(child,dom))
  }

  parentDOM.appendChild(dom)
}

render(vdom,document.getElementById('root'))
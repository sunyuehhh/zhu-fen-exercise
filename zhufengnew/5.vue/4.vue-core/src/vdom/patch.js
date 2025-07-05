export function patch(oldVnode,vnode){
  if(!oldVnode){//如果是组件 这个oldVnode是undefined
    return createElm(vnode);//vnode是组件中的内容
  }
  if(oldVnode.nodeType==1){//真实的节点
  // 将虚拟节点转换成真实节点
  let el=createElm(vnode)//产生真实的dom
  let parentElm=oldVnode.parentNode;//获取老的app的父亲 =>body
  parentElm.insertBefore(el,oldVnode.nextSibling) //当前的真实元素插入到app的后面
  parentElm.removeChild(oldVnode)//删除老的节点

  return el
  }else{
    console.log(oldVnode,vnode)
    // 1.比较两个元素的标签  标签不一样直接替换掉即可
    if(oldVnode.tag!==vnode.tag){
      // 老的dom元素
     return oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el)
    }

    // 2.有种可能是标签一样  <div>1</div> <div>2</div>
    // 文本节点的虚拟节点tag 都是undefined
    if(!oldVnode.tag){//文本的比对
      if(oldVnode.text!==vnode.text){
        return oldVnode.el.textContent=vnode.text
      }

    }

    // 3.标签一样  并且需要开始比对标签的属性  和  儿子了
    // 标签一样直接复用即可
    let el=vnode.el=oldVnode.el;//复用老节点

    // 更新属性  用新的虚拟节点的属性和老的比较 去更新节点
    updateProperties(vnode,oldVnode.data)


    // 比较儿子
    let oldChildren=oldVnode.children||[]
    let newChildren=vnode.children||[]

    if(oldChildren.length>0&&newChildren.length>0){
      // 老的有儿子  新的也有儿子  diff算法
      updateChildren(oldChildren,newChildren,el)

    }else if(oldChildren.length>0){//新的没有
      el.innerHTML=''
    }else if(newChildren.length>0){//老的没有
      for(let i=0;i<newChildren.length;i++){
        let child=newChildren[i]
        // 浏览器有性能优化  不用自己在搞文档碎片了
        el.appendChild(createElm(child))
      }


    }

  }

}

function isSameVnode(oldVnode,newVnode){
  return oldVnode.tag===newVnode.tag&&oldVnode.key==newVnode.key

}


export function updateChildren(oldChildren,newChildren,parent){
  // vue 中的diff算法做了跟多优化
  // DOM中操作有很多常见的逻辑  把节点插入到当前儿子的头部、尾部、儿子倒叙正序
  // vue2中采用的是双指针的方式

  // 在尾部添加
  
  // 我要做一个循环 同时循环老的和新的  哪个先结束  循环就停止  将多余的删除或者添加进去

  // 开头指针
  let oldStartIndex=0;//老的索引
  let oldStartVnode=oldChildren[0];//老的索引指向的节点
  let oldEndIndex=oldChildren.length-1
  let oldEndVnode=oldChildren[oldEndIndex]

  let newStartIndex=0;
  let newStartVnode=newChildren[0]
  let newEndIndex=newChildren.length-1
  let newEndVnode=newChildren[newEndIndex]

  function makeIndexByKey(children){
    let map={}
    children.forEach((item,index)=>{
     item.key&&(map[item.key]=index);//{0:A,1:B,2:C,3:D}
    })

    return map

  }

  let map=makeIndexByKey(oldChildren)





  // 我要做一个循环  同时循环老的和新的  哪个先结束  循环就停止  将多余的删除或者添加进去

  // 比较谁先循环停止 
  while(oldStartIndex<=oldEndIndex&&newStartIndex<=newEndIndex){
    if(!oldStartVnode){//指针指向了null 跳过这次的处理
      oldStartVnode=oldChildren[++oldStartIndex]

    } else if(!oldEndVnode){
      oldEndVnode=oldChildren[--oldEndIndex]
    }else if(isSameVnode(oldStartVnode,newStartVnode)){//如果两人是同一个元素  比对儿子
      patch(oldStartVnode,newStartVnode);//更新属性和再去递归更新子节点

      oldStartVnode=oldChildren[++oldStartIndex]
      newStartVnode=newChildren[++newStartIndex]

    }else if(isSameVnode(oldEndVnode,newEndVnode)){
      patch(oldEndVnode,newEndVnode)
      oldEndVnode=oldChildren[--oldEndIndex]
      newEndVnode=newChildren[--newEndIndex]

    }else if(isSameVnode(oldStartVnode,newEndVnode)){//老的尾部和新的头部都比较
      patch(oldStartVnode,newEndVnode);
      // 将当前元素插入到尾部的  下一个元素的前面
      parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling);
      oldStartVnode=oldChildren[++oldStartIndex]
      newEndVnode=newChildren[--newEndIndex]

    }else if(isSameVnode(oldEndVnode,newStartVnode)){
      patch(oldEndVnode,newStartVnode)
      parent.insertBefore(oldEndVnode.el,oldStartVnode.el)
      oldEndVnode=oldChildren[--oldEndIndex]
      newStartVnode=newChildren[++newStartIndex]

      // 为什么要key  循环的时候为什么不能用index作为key
      // index为key  就相当于没有key
      
    }else{
      // 儿子之间没有关系...暴力比对
      let moveIndex=map[newStartVnode.key];//拿到开头的虚拟节点key 去老的中找
      if(moveIndex==undefined){//不需要移动说明没有key复用的
        parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)

      }else{
        let moveVNode=oldChildren[moveIndex];//这个老的虚拟节点需要移动
        oldChildren[moveIndex]=null
        parent.insertBefore(moveVNode.el,oldStartVnode.el)
        patch(moveVNode,newStartVnode)
      }

      newStartVnode=newChildren[++newStartIndex];//用新的不停的去老的里面找
    }
    // 反转节点  头部移动尾部  尾部移动到头部

  }

  if(newStartIndex<=newEndIndex){
    for(let i=newStartIndex;i<=newEndIndex;i++){
      // parent.appendChild(createElm(newChildren[i]))
      // 向后插入ele=null
      // 向钱插入ele就是当前向谁前面插入
      let ele=newChildren[newEndIndex+1]==null?null:newChildren[newEndIndex+1].el
      parent.insertBefore(createElm(newChildren[i]),ele)
    }

  }

  // 老的节点还有没处理的，说明这些老节点是不需要的节点  如果这里面有null说明，这个节点已经被处理过了，
  // 跳过即可
  if(oldStartIndex<=oldEndIndex){
    for(let i=oldStartIndex;i<=oldEndIndex;i++){
      let child=oldChildren[i]
      if(child!==undefined){
        parent.removeChild(child.el)
      }
    }

  }



}


function createComponent(vnode){
  // 调用hook中的init方法
  let i=vnode.data
  if((i=i.hook)&&(i=i.init)){
    i(vnode)

  }

  if(vnode.componentInstance){
    return true
  }

}


export function createElm(vnode){
  console.log(vnode,'createElm')
  let {tag,children,key,data,text}=vnode
  if(typeof tag=='string'){ //创建元素  放到vnode.el上

    if(createComponent(vnode)){//组件渲染后的结果  放到当前组件的实例上 vm.$el
      return vnode.componentInstance.$el;//组件对应的dom元素

    }








    vnode.el=document.createElement(tag)


    // 只有元素才有属性
    updateProperties(vnode)




    children.forEach(child => { //遍历儿子  将儿子渲染后的结果扔到父亲中
      vnode.el.appendChild(createElm(child))
      
    });
  }else{ //创建文件  放到vnode.el上
    vnode.el=document.createTextNode(text)
  }

  return vnode.el

}

// vue 的渲染流程=>先初始化数据=>将模板进行编译=>render函数=>生成虚拟节点=>生成真实的dom=>扔到页面上


function updateProperties(vnode, oldProps = {}) {
  const newProps = vnode.data || {};
  const el = vnode.el;

  // 删除老的属性：老的有新的没有
  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      el.removeAttribute(key);
    }
  }

  // 样式处理
  const newStyle = newProps.style || {};
  const oldStyle = oldProps.style || {};

  // 删除旧样式中新的没有的部分
  for (let key in oldStyle) {
    if (!newStyle.hasOwnProperty(key)) {
      el.style[key] = '';
    }
  }

  // 设置新属性
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newStyle) {
        el.style[styleName] = newStyle[styleName];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}

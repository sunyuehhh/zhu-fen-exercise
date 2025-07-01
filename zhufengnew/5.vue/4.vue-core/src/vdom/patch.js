export function patch(oldVnode,vnode){
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

  }

}


export function createElm(vnode){
  let {tag,children,key,data,text}=vnode
  if(typeof tag=='string'){ //创建元素  放到vnode.el上
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

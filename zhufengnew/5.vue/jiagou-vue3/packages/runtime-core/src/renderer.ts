import { ShapeFlags } from '@vue/shared'
import { isSameVnode,Text,Fragment } from './createVnode'
import { getSeq } from './seq'
import { reactive, ReactiveEffect } from '@vue/reactivity'
import {queueJob} from './scheduler'

export function createRenderer(renderOptions){
  const {
    createElement:hostCreateElement,
    createText:hostCreateText,
    insert:hostInsert,
    remove:hostRemove,
    querySelector:hostQuerySelector,
    setElementText:hostSetElementText,
    setText:hostSetText,
    createComment:hostCreateComment,
    nextSibling:hostNextSibling,
    parentNode:hostParentNode,
    patchProp:hostPatchProp
    

  }=renderOptions

  const unmount=(vnode)=>{
    const {shapeFlag,type,children}=vnode
    if(type===Fragment){
      return unmountChildren(children)
    }
    // if(shapeFlag&ShapeFlags.ELEMENT){
      hostRemove(vnode.el);//对于元素来说  直接删除dom即可
    // }

  }


  const mountChildren=(children,container)=>{
    children.forEach((child) => {
      patch(null,child,container)
      
    });

  }

    const unmountChildren=(children)=>{
    children.forEach((child) => {
      unmount(child)
      
    });

  }

  const mountElement=(vnode,container,anchor)=>{
    // 递归遍历  虚拟节点将其转换成真实节点
    const {type,props,children,shapeFlag}=vnode
    const el=(vnode.el= hostCreateElement(type))
    if(props){
      for(let key in props){
        hostPatchProp(el,key,null,props[key])
      }
    }

    if(children){
      if(shapeFlag&ShapeFlags.TEXT_CHILDREN){
        hostSetElementText(el,children)
      }else if(shapeFlag&ShapeFlags.ARRAY_CHILDREN){
        mountChildren(children,el)

      }
    }



    hostInsert(el,container,anchor)

  }


  const patchProps=(oldProps,newProps,el)=>{
    if(oldProps==newProps) return
    for(let key in newProps){
      // 真实操作dom
      let prevVal=oldProps[key]
      let nextVal=newProps[key]

      if(prevVal!==nextVal){
        hostPatchProp(el,key,prevVal,nextVal)
      }
    }

    for(let key in oldProps){
      if(!(key in newProps)){
        hostPatchProp(el,key,oldProps[key],null)
      }
    }

  }

  const patchKeyChildren=(c1,c2,el)=>{
    // vue3 中的diff算法  1.同序列挂载和卸载  2.最长递增子序列 计算最小偏移量来进行更新
    let i=0//开头的位置
    let e1=c1.length-1
    let e2=c2.length-1

    // a b c
    // a b d

    // sync from start
    while(i<=e1&&i<=e2){
      const n1=c1[i]
      const n2=c2[i]
      if(isSameVnode(n1,n2)){
        patch(n1,n2,el)
      }else{
        break
      }
      i++

    }

    // sync from end
    while(i<=e1&&i<=e2){
      const n1=c1[e1]
      const n2=c2[e2]
      if(isSameVnode(n1,n2)){
        patch(n1,n2,e1)
      }else{
        break
      }

      e1--
      e2--
    }



    if(i>e1){
      // 新的多 老的少
      while(i<=e2){
        const nextPos=e2+1
        const anchor=c2[nextPos]?.el;//获取下一个元素的el
        // 我得知道是向前插入  还是向后插入 如果是向前插入得有参照物
        patch(null,c2[i],el,anchor)

        i++
      }
    }else if(i>e2){
      // 老得多 新得少
      while(i<=e1){
        unmount(c1[i])

        i++
      }

    }


    // 以上得情况  都是一些头尾得特殊操作 但是不适用其他情况
    let s1=i
    let s2=i

    // s1-e1 [c d e]
    // s2-e2 [d c e h]

    // 如何复用 key
    const keyToNewIndexMap=new Map()

    const toBePatched=e2 - s2 + 1;//新的儿子有这么多个需要被patch
    const newIndexToOldIndex=new Array(toBePatched).fill(0)

    for(let i=s2;i<=e2;i++){
      keyToNewIndexMap.set(c2[i].key,i)
    }

    for(let i=s1;i<=e2;i++){
      const vnode=c1[i]
      let newIndex=keyToNewIndexMap.get(vnode.key)
      if(newIndex==undefined){
        // 老的里面有新的没有
        unmount(vnode)
      }else{
        newIndexToOldIndex[newIndex - s2]=i+1
        // 用来的虚拟节点  c和新的虚拟节点做比对
        patch(vnode,c2[newIndex],el);//这里只是比较自己的属性和儿子  并没有移动

      }
    }

    const increasingNewIndexSequence=getSeq(newIndexToOldIndex)

    let j=increasingNewIndexSequence.length-1;//取出数组的最后一个索引




    // 接下来要计算移动哪些节点   *最长递增子序列

    // 倒叙插入
    for(let i=toBePatched-1;i>=0;i--){
      const curIndex=s2+i
      const nextChild=c2[curIndex+1]?.el;//取到了f
      if(newIndexToOldIndex[i]==0){
        // 新的里面没法直接插入
        patch(null,c2[curIndex],el,nextChild)
      }else{
        // 已经有这个元素了 直接做插入
        // 这里需要判断  当前i和j 如果一致说明这一项不需要移动

        if(i==increasingNewIndexSequence[j]){
          // 如果当前这一项和序列中相等  说明不用任何操作,直接跳过即可
          j--;
        }else{
        hostInsert(c2[curIndex].el,el,nextChild);//不再序列中意味着此元素需要移动
        }
      }
    }

  }

  // 比较双方的儿子节点的差异
  const patchChildren=(n1,n2,el)=>{
    // text [] null
    const c1=n1.children
    const c2=n2.children

    const prevShapeFlag=n1.shapeFlag
    const shapeFlag=n2.shapeFlag

    // 当前是文本呢  之前就是空  文本  数组

    if(shapeFlag&ShapeFlags.TEXT_CHILDREN){
      if(prevShapeFlag&ShapeFlags.ARRAY_CHILDREN){ //老的是数组  新的是文本
        // 老的是数组  都移除即可
        unmountChildren(c1)

      }
      // 新的是文本 老的可能是文本  或者空
      if(c1!==c2){
        hostSetElementText(el,c2)
      }

    }else{
      // 之前是数组
      if(prevShapeFlag&ShapeFlags.ARRAY_CHILDREN){
        if(shapeFlag&ShapeFlags.ARRAY_CHILDREN){
          // 双方都是数组 核心diff算法  todo...
          patchKeyChildren(c1,c2,el)
        }else{
          // 现在是空的情况
          unmountChildren(c1)
        }
      }else{
        // 老的是文本  或者是空
        if(prevShapeFlag&ShapeFlags.TEXT_CHILDREN){
          hostSetElementText(el,"")
        }
        if(shapeFlag&ShapeFlags.ARRAY_CHILDREN){
          mountChildren(c2,el)
        }
      }



    }






    // patchFlag + blockTree 编译优化 只有写模板的时候  才享受这种优化








    
  }

  const patchElement=(n1,n2)=>{
    let el=(n2.el=n1.el);//将老的虚拟节点上的dom直接给新的虚拟节点

    const oldProps=n1.props||{}
    const newProps=n2.props||{}

    // 比较前后属性的差异  diff prop
    patchProps(oldProps,newProps,el)

    patchChildren(n1,n2,el)

  }

  const processElement=(n1,n2,container,anchor)=>{
    if(n1==null){
      mountElement(n2,container,anchor)
    }else{
      // 元素更新了
      patchElement(n1,n2)
    }
  }


  const processText=(n1,n2,el)=>{
    console.log(n1,n2,el,'********')
    if(n1==null){
      // 这里不要用innerHTML
     hostInsert((n2.el = hostCreateText(n2.children)),el)
    }else{
      let el=(n2.el=n1.el);//复用文本
      if(n1.children===n2.children){
        return 
      }
      hostSetText(el,n2.children)
    }

  }

  const processFragment=(n1,n2,el)=>{
    if(n1==null){
      mountChildren(n2.children,el)
    }else{
      console.log(n1,n2,'fragment')
      patchKeyChildren(n1.children,n2.children,el)
    }

  }

  const initProps=(instance,userProps)=>{
    const attrs={}
    const props={}

    const options=instance.propsOptions||{};//组件上接受的props
    if(userProps){
      for(let key in userProps){
        // 属性中应该包含属性的校验
        const value=userProps[key]

        if(key in options){
          props[key]=value

        }else{
          attrs[key]=value
        }

      }
    }

    instance.attrs=attrs
    console.log(props,instance,userProps,'props的内容')
    instance.props=reactive(props)

  }

  const publicProperties={
    $attrs:(i)=>i.attrs,
  }


  const mountComponent=(n2,el,anchor)=>{
    console.log(n2,el,anchor,'mountComponent')
    // 组件的数据和渲染函数
    const {data=()=>({}),render,props:propsOptions={}}=n2.type


    // getCurrentInstance
    const instance={
      state:{},
      isMounted:false,//默认组件没有初始化  初始化后会将此属性isMounted true
      subTree:null,
      vnode:n2,//组件的虚拟节点
      update:null,
      attrs:{},
      props:{},
      propsOptions,//组件中接受的props
      proxy:null,
      render:null
    }//此实例就是用来记录组件的属性的  相关信息的

    instance.vnode.component=instance

    // 实例上 props和attrs n2.props 是组件的虚拟节点的props
    initProps(instance,n2.props);//用户传递给虚拟节点的props

    instance.state=reactive(data.call(instance.proxy));//将数据变成响应式的

    instance.proxy=new Proxy(instance,{
      get(target,key,receiver){
        const {state,props}=target
        if(state&&key in state){
          return state[key]
        }else if(key in props){
          return props[key]

        }

        let getter=publicProperties[key]
        if(getter){
          return getter(instance)
        }

      },
      set(target,key,value,receiver){
        const {state,props}=target
        if(state&&key in state){
          state[key]=value
          return true
        }else if(key in props){
          console.warn('不允许修改props')
          return true

        }

        return true

      }
    })


    const updateProps=(instance,nextProps)=>{
      // 应该考虑吧一下attrs  和props
      let prevProps=instance.props
      for(let key in nextProps){
        prevProps[key]=nextProps[key]
      }

      for(let key in prevProps){
        if(!(key in nextProps)){
          delete prevProps[key]
        }
      }


    }

    const updatePreRender=(instance,next)=>{
      instance.next=null
      instance.vnode=next;//更新虚拟节点

      updateProps(instance,next.props)

    }

    const componentUpdateFn=()=>{
      // 组件要渲染的 虚拟节点是render函数返回的结果
      // 组件有自己的虚拟节点,返回的虚拟节点 subTree
      

      // 当调用render方法的时候  会触发响应式的数据访问  进行effect的收集
      // 所以数据变化后会重新触发effect执行

      if(!instance.isMounted){

        const subTree=render.call(instance.proxy,instance.proxy);//这里先暂时将proxy 设置为状态
        patch(null,subTree,el,anchor)
        instance.subTree=subTree
        instance.isMounted=true
        console.log(subTree,'初始化')
      }else{
        const prevSubTree=instance.subTree

        //这里再下次渲染前需要更新属性  更新属性后再渲染 获取最新的虚拟DOM
        const next=instance.next
        if(next){
          // 说明属性有更新
          updatePreRender(instance,next)
        }


        const nextSubTree=render.call(instance.proxy,instance.proxy)
        instance.subTree=nextSubTree
        patch(prevSubTree,nextSubTree,el,anchor)
        console.log(prevSubTree,nextSubTree,'状态变化了')
    
      }


    }

    const effect=new ReactiveEffect(componentUpdateFn,()=>{
      // 这里我们可以延迟调用componentUpdateFn

      // 批处理 + 去重

      queueJob(instance.update)

    });//对应的effect方法
    const update= instance.update =effect.run.bind(effect)
    update()

  }

  const updateComponent=(n1,n2,el,anchor)=>{
    // 这里我们  属性发生了变化  会执行到这里
    // 插槽更新也会执行
    const instance=(n2.component=n1.component)


    if(shouldComponentUpdate(n1,n2)){
    instance.next=n2;//暂存新的虚拟节点
    instance.update()
    }

  }

  function hasChanged(oldProps={},newProps={}){
    // 直接查看数量  数量后变化  就不用遍历了
    let oldKeys=Object.keys(oldProps)
    let newKeys=Object.keys(newProps)
    if(oldKeys.length!==newKeys.length){
      return true
    }

    for(let i=0;i<newKeys.length;i++){
      const key=newKeys[i]
      if(newProps[key]!==oldProps[key]){
        return true
      }
    }

    return false

  }


  function shouldComponentUpdate(n1,n2){
    const oldProps=n1.props;
    const newProps=n2.props;

    if(oldProps==newProps) return false
    return hasChanged(oldProps,newProps)

  }

  const processComponent=(n1,n2,el,anchor)=>{
    if(n1==null){
      mountComponent(n2,el,anchor)
    }else{
      updateComponent(n1,n2,el,anchor);//组件的属性变化了  或者插槽变化了
    }

  }

  const patch=(n1,n2,container,anchor=null)=>{
    // 更新和初次渲染

    if(n1&&!isSameVnode(n1,n2)){//更新
      unmount(n1)
      n1=null
    }


    const {type,shapeFlag}=n2

    console.log(type,'type')

    switch (type){
      case Text:
        processText(n1,n2,container)
        break;
      case Fragment:
        processFragment(n1,n2,container)
        break;
      default:
        if(shapeFlag&ShapeFlags.ELEMENT){
          // 元素的处理
          processElement(n1,n2,container,anchor)
        }else if(shapeFlag&ShapeFlags.COMPONENT){
          console.log(n1,n2,container,anchor,'COMPONENT')
          processComponent(n1,n2,container,anchor)
        }
    }

    // if(n1==null){
    //   mountElement(n2,container)
    // }else{
    //   // 元素更新了
    //   patchElement(n1,n2)
    // }

  }
  const render=(vnode,container)=>{
    // 虚拟节点的创建  最终生成真实的dom渲染到容器中
    // 1.卸载 render(null,app)
    // 2.更新 之前渲染过了 现在在渲染  之前渲染过一次  产生了虚拟节点  再次渲染产生了虚拟节点
    // 3.初次挂载
      console.log(renderOptions,vnode,container)

      if(vnode==null){
        // 卸载逻辑
        if(container._vnode){
          // 说明之前渲染过了 现在要移除掉
          unmount(container._vnode);//虚拟节点中存放了真实节点
        }
      }else{
        patch(container._vnode||null,vnode,container)
      }

      container._vnode=vnode

      

    }
  return {
    render
  }
}


// runtime-core中的createRenderer是不基于平台的
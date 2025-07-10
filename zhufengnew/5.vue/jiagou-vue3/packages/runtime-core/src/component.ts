import { reactive, ReactiveEffect } from '@vue/reactivity'
import { isFunction } from '@vue/shared'
export function createComponentInstance(n2){
    // getCurrentInstance
    const instance={
      state:{},
      isMounted:false,//默认组件没有初始化  初始化后会将此属性isMounted true
      subTree:null,
      update:null,
      attrs:{},
      props:{},
      propsOptions:n2.type.props||{},//组件中接受的props
      proxy:null,
      render:null
    }//此实例就是用来记录组件的属性的  相关信息的

    return instance
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
    instance.props=reactive(props)

  }


  const publicProperties={
    $attrs:(i)=>i.attrs,
  }

export function setupComponent(instance,n2){

      // 实例上 props和attrs n2.props 是组件的虚拟节点的props
      initProps(instance,n2.props);//用户传递给虚拟节点的props
  
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

    // 组件的数据和渲染函数
    const {data=()=>({})}=n2.type
    if(isFunction(data)){
      instance.state=reactive(data.call(instance.proxy));//将数据变成响应式的
    }
    instance.render=instance.vnode.type.render;
}

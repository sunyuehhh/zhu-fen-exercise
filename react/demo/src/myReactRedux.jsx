import React,{createContext,useContext,useEffect,useState,useMemo} from "react"
import { bindActionCreators } from "redux"
const ThemeContext=createContext()
/**
 * Provider:把传递进来的store放在根组件的上下文中
 */
export function Provider(props){
  let {store,children}=props
  return <ThemeContext.Provider value={{store}}>
    {children}
  </ThemeContext.Provider>
}
/**
 * connect:获取上下文中的store,然后把公共状态、要派发的方式等，都基于属性传递给需要渲染的组件；把让组件更新的
 * 方法放在事件池中！！
 */

export function connect(mapStateToProps,mapDispatchToProps){
  // 处理默认值
  if(!mapStateToProps){
    // 不写则什么都不给组件传递
    mapDispatchToProps=()=>({})
  }
  if(!mapDispatchToProps){
    // 不写则:把dispatch方法传递给组件
    mapDispatchToProps=(dispatch)=>{
      return {
        dispatch
      }
    }
  }
  return function currying(Component){
    // Component:最终要渲染的组件
    // HOC:我们最后基于export default导出的组件
    return function HOC(props){
      // 我们需要获取上下文中的store
      let {store}=useContext(ThemeContext),{getState,dispatch,subscribe}=store;

      // 向事件池中加入组件更新的方法
      let [,forceUpdate]=useState(0)

      useEffect(()=>{
        let unsubscribe=subscribe(()=>{
          forceUpdate(+new Date())
        })
        return ()=>{
          // 释放的时候执行:把放在事件池中的函数移除掉
          unsubscribe()
        }
      },[])

      // 把mapStateToProps,mapDispatchToProps  把执行的返回值，所谓属性传递给组件！！
      let state=getState()
      let nextState=useMemo(()=>{
        return mapStateToProps(state);
      },[state])

      let dispatchProps={}
      if(typeof mapDispatchToProps=='function'){
        // 是函数直接执行即可
        dispatchProps=mapDispatchToProps(dispatch);
      }else{
        // 是actionCreator对象,需要京股票bindActionCreators处理
        dispatchProps=bindActionCreators(mapDispatchToProps,dispatch)
      }


      return <Component {...props} {...nextState} {...dispatchProps}></Component>

    }

  }
}

/**
 * export function connect(state=>state.vote,
 * dispatch=>{
 * return {
 * support(){
 * dispatch(action.vote.support())
 * },
 * oppose(){
 * dispatch(action.vote.oppose())
 * }
 * }
 * }
 * 
 * )(Vote)
 */
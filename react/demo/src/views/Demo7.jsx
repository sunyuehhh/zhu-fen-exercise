import React,{useState,useEffect,useLayoutEffect, useRef,useImperativeHandle,useMemo,useCallback} from "react";
import { Button } from "antd";

/**
 * 自定义Hook:
 * 作用：提取封装一些公共的处理逻辑
 * 玩法: 创建一个函数，名字需要是useXxx,后期就可以在组件中调用这个方法！！
 */

const usePartialState=function usePartialState(initialValue){
  let [state,setState]=useState(initialValue)
  // setState不支持部分状态修改
  // setPartial:我们期望这个方法可以支持部分状态的更改
  const setPartial=function(partialState){
    setState({
      ...state,
      ...partialState
    })


  }
  return [state,setPartial]
}



/**
 * 自定义Hook，在组件第一次渲染完毕后，统一干点啥
 */

const useDidMount=function useDidMount(title){
  if(!title) title='React系统课'
  // 基于React内置的Hook函数，实现需求即可
  useEffect(()=>{
    document.title=title
  },[])
}





const Demo=function Demo(props){
    console.log('RENDER渲染')
    let [state,setPartial]=usePartialState({
      supNum:10,
      oppNum:5
    })

    const handle=(type)=>{
      if(type==='sup'){
        setPartial({
          ...state,
          supNum:state.supNum+1
        })
        return 

      }
      setPartial({
        ...state,
        oppNum:state.oppNum+1
      })


    }
    return <div className="demo">   
      支持人数{state.supNum} 
      反对人数{state.oppNum}
      <Button onClick={handle.bind(null,'sup')}>支持</Button>    
      <Button onClick={handle.bind(null,'opp')}>反对</Button>    
    </div>
}
export default Demo
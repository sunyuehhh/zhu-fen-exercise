import * as React from "react";
import * as ReactDOM from 'react-dom'
import { IndeterminateComponent } from "./ReactWorkTags";
import { render } from "./ReactFiberWorkLoop";
import { useReducer } from "./ReactFiberHooks";

// redux 接受老状态  返回新状态
const reducer=(state,action)=>{
  if(action.type==='add'){
    return state+1
  }else{
    return state
  }

}

function Counter(){
  const [number,setNumber]=useReducer(reducer,0)



  return (<div onClick={()=>{
    setNumber({
      type:'add'
    })
  }}>
    {number}
  </div>)

}

// ReactDOM.render(<Counter />,document.getElementById('root'))


let workInProgress={
  tag:IndeterminateComponent,//Fiber的类型   函数组件 在初次渲染的时候对应的类型 是IndeterminateComponent
  type:Counter,//此组件的具体  类型是哪个组件
  alternate:null,//上一个渲染的fiber

}

render(workInProgress)
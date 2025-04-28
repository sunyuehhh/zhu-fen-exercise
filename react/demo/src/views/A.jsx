import React,{useReducer, useState} from "react";
import { useLocation, Outlet,useMatch,useParams,Link} from "react-router";
const initialState={
  num:0
}
const reducer=function reducer(state,action){
  state={...state}
  switch(action.type){
    case 'plus':
      state.num++;
      break;
    case 'minus':
      state.num--;
      break;
    default:
  }

  return state
}
const A=function A(props){
  const [state,dispatch]=useReducer(reducer,initialState)
  console.log(state,dispatch,'&&&&&&&&&&')
  return <div className="box">
    <span>{state.num}</span>
    <br />
    <button onClick={()=>{
      dispatch({type:'plus'})
    }}>增加</button>
    <button onClick={()=>{
      dispatch({type:'minus'})
    }}>减少</button>
   
  </div>
}


export default A
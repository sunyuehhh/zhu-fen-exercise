import React from "react";
import { useLocation, useNavigate } from "react-router";

const B=function B(props){
  const navigation=useNavigate()
  const handle=()=>{
    navigation('/a',{
      state:{
        id:100,
        name:'隐式传参'
      },
      replace:true,//历史记录池替换现有地址
    })

  }
  return <div className="box">
    B组件内容
    <button onClick={handle}>跳转</button>
  </div>
}


export default B


/**
 * 在react-router-don v6中，实现路由跳转的方式
 * <Link/NavLink to="/a"> 点击跳转路由
 * <Navigation to="/a" /> 遇到这个组件就会跳转
 * 编程式导航：取消了history对象，基于navigate函数实现
 * const navigation=useNavigation();
 *   const navigation=useNavigate()
  navigation('/a')
  navigation('/a',{replace:true})
  navigation({
    pathname:'/a'
  })
  navigation({
    pathname:'/a',
    search:'?id=100&name=sunyue'
  })
 */
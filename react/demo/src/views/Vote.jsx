import React, { useCallback, useContext, useState,useEffect } from "react";
import VoteMain from './VoteMain.jsx'
import VoteFooter from './VoteFooter.jsx'
import ThemeContext from "../ThemeContext.js";
import { connect } from "react-redux";

const Vote=function Vote(props){
  let {supNum,oppNum}=props

  return <div className="vote-box">
    <div className="header">
      <div className="num">{supNum+oppNum}</div>
           <VoteMain></VoteMain>
           <VoteFooter></VoteFooter>
    </div>
  </div>
}
export default connect(state=>{
  return state.vote
})(Vote);

/**
 * connect(mapStateToProps,mapDispatchToProps)(我们要渲染的组件)
 *   mapStateToProps:可以获取到redux中的公共状态，把需要的信息作为属性，传递组件即可
 *   connect(state=>{
 *        存储redux容器中,所有模块的公共状态信息
 *        返回对象中的信息，就是要作为属性，传递给组件的信息
 *    return {
 *        AA:state.vote.supNum
 *    }
 *   })(Vote)
 */
import React,{useContext} from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import ThemeContext from "../ThemeContext";
import action from "../store/actions";
import { connect } from "react-redux";

const VoteFooter=function VoteFooter(props){
  let {support,oppose}=props



  return  <div className="vote-box">
  <Button type="primary" onClick={()=>{
support()
  }}>支持</Button>
  <Button type="primary" onClick={()=>{
oppose()
  }} danger>反对</Button>
</div>
}



export default connect(null,action.vote)(VoteFooter)
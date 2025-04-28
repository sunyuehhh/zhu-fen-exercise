import PropTypes from "prop-types";
import React from "react";
const Dialog=function Dialog(props){
  let {title='温馨提示',content,children}=props
  children=React.Children.toArray(children)
  return <div className="dialog-box">
    <div className="header">
      <h2 className="title">{title}</h2>
      <span>X</span>
    </div>
    <div className="main-box">
      {content}
    </div>
    {
      children.length>0?<div className="footer">
      {children}
    </div>:null
    }
  </div>

}


Dialog.propTypes={
  title:PropTypes.string,
  content:PropTypes.string.isRequired
}

export default Dialog;
// import React from "react";
// import ReactDOM from 'react-dom'
import React from "./react"
import ReactDOM from './react-dom'
// let jsx=<h1 className="title" style={{color:'red'}}>hello</h1>

// console.log(jsx,'jsx')

// function FunctionComponent(props){
//   let element=<h1 className="title" style={{color:'red'}}>
//     {props.msg}
//     <span>world</span>
//   </h1>

//   return element
// }

// let element=<FunctionComponent msg="消息" age={12} />

// console.log(element,'element')


class ClassComponent extends React.Component{
  render(){
      let element=<h1 className="title" style={{color:'red'}}>
    {this.props.msg}
    <span>world</span>
  </h1>

  return element

  }
}


let element=<ClassComponent msg="消息" age={12} />


ReactDOM.render(element,document.getElementById('root'))
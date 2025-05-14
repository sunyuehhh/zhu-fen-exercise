import React from "./react"
import ReactDOM from './react-dom'

function withMouseTracker(OldComponent){
  return class MouseTracker extends React.Component{
    constructor(props){
      super(props)
      this.state={
        x:0,
        y:0
      }
  
    }
  
    handleMouseMove=(event)=>{
      this.setState({
        x:event.clientX,
        y:event.clientY
      })
  
  
    }
  
    render(){
      return <div onMouseMove={this.handleMouseMove}>
        <OldComponent {...this.state} />
      </div>
    }
  
  }
  

}

function Show(props){
   return (
    <>
      <h1>移动鼠标</h1>
      <p>当前鼠标位置：{props.x}, {props.y}</p>
    </>
  );
}

const MouseTrackerShow=withMouseTracker(Show)

console.log(MouseTrackerShow,'MouseTrackerShow')

ReactDOM.render(<MouseTrackerShow />,document.getElementById('root'))
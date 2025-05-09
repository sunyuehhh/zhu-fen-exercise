// import React from "react";
// import ReactDOM from 'react-dom'
import React from "./react"
import ReactDOM from './react-dom'
import { updateQueue } from "./component"

class Counter extends React.Component{
  // 类的构造函数中唯一可以给this.state直接赋值的地方
  constructor(props){
    super(props)
    this.state={
      number:0
    }
  }

  handleClick = () => {
    // // 在方法执行之前把这个isBatchingUpdate设置为true
    // updateQueue.isBatchingUpdate=true
    this.setState({
      number:this.state.number+1
    })
    this.setState({
      number:this.state.number+1
    })
    // // 在这个方法结束之后进行批量更新
    // updateQueue.batchUpdate()

  }
  render(){
    return <div>
      <p>{this.props.title}</p>
      <p>{this.state.number}</p>
      <button onClick={this.handleClick}>+</button>
    </div>
  }

}

ReactDOM.render(<Counter title="定时器" />,document.getElementById('root'))


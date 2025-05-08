// import React from "react";
// import ReactDOM from 'react-dom'
import React from "./react"
import ReactDOM from './react-dom'

class Counter extends React.Component{
  // 类的构造函数中唯一可以给this.state直接赋值的地方
  constructor(props){
    super(props)
    this.state={
      number:0
    }
  }

  handleClick = () => {
    this.setState({
      number:this.state.number+1
    })

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


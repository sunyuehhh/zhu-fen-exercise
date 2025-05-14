import React from "./react"
import ReactDOM from './react-dom'

class Counter extends React.Component{
  static defaultProps={
    name:'珠峰架构'
  }
  constructor(props){
    super(props)
    this.state={number:0}
    console.log('Counter 1.constructor')

  }



  handleClick=()=>{
    this.setState({
      number:this.state.number+1
    })
  }

  render(){
    console.log('Counter 3.render')
    return <div>
      <p>{this.state.number}</p>
      <button onClick={this.handleClick}>+</button>
      <ChildCounter count={this.state.number}></ChildCounter>
    </div>
  }
}


class ChildCounter extends React.Component{
  state={
    count:0
  }

  static getDerivedStateFromProps(nextProps,nextState){
    return {
      count:nextProps.count*2
    }
  }

  render(){
    return <>
    {
      this.state.count
    }
    </>
  }
}


ReactDOM.render(<Counter />,document.getElementById('root'))
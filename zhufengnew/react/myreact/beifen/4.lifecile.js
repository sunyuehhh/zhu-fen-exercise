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

  UNSAFE_componentWillMount(){
    console.log('Counter 2.componentWillMount')
  }

  componentDidMount(){
    console.log('Counter 4.componentDidMount')
  }

  shouldComponentUpdate(nextProps,nextState){
    console.log('5.shouldComponentUpdate')

    return nextState.number%2===0
  }

  UNSAFE_componentWillUpdate(){
    console.log('6.componentWillUpdate')
  }

  componentDidUpdate(){
    console.log('7.componentDidUpdate')
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
    </div>
  }
}


ReactDOM.render(<Counter />,document.getElementById('root'))
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
    console.log('Counter 5.shouldComponentUpdate')

    return nextState.number%2===0
  }

  UNSAFE_componentWillUpdate(){
    console.log('Counter 6.componentWillUpdate')
  }

  componentDidUpdate(){
    console.log('Counter 7.componentDidUpdate')
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
      {this.state.number===4?null:<ChildCounter count={this.state.number}></ChildCounter>}
    </div>
  }
}


class ChildCounter extends React.Component{
  
  UNSAFE_componentWillMount(){
    console.log('ChildCounter 1.componentWillMount')
  }

  componentDidMount(){
    console.log('ChildCounter 3.componentDidMount')
  }

  UNSAFE_componentWillReceiveProps(newProps){
    console.log('ChildCounter 4.UNSAFE_componentWillReceiveProps')

  }

  shouldComponentUpdate(nextProps,nextState){
    console.log('ChildCounter 5.shouldComponentUpdate')

    return nextProps.count%3===0
  }

  // UNSAFE_componentWillUpdate(){
  //   console.log('ChildCounter 6.componentWillUpdate')
  // }

  // componentDidUpdate(){
  //   console.log('ChildCounter 7.componentDidUpdate')
  // }
  render(){
    console.log('ChildCounter 2.render')
    return <>
    {
      this.props.count
    }
    </>
  }

  componentWillMount(){
    console.log('ChildCounter 6.componentWillMount')
  }

}


ReactDOM.render(<Counter />,document.getElementById('root'))
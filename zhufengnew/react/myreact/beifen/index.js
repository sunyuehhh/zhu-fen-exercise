// // import React from "react";
// // import ReactDOM from 'react-dom'
// import React from "./react"
// import ReactDOM from './react-dom'
// import { updateQueue } from "./component"

// class Counter extends React.Component{
//   // 类的构造函数中唯一可以给this.state直接赋值的地方
//   constructor(props){
//     super(props)
//     this.state={
//       number:0
//     }
//   }

//   handleClick = () => {
//     // // 在方法执行之前把这个isBatchingUpdate设置为true
//     // updateQueue.isBatchingUpdate=true
//     this.setState({
//       number:this.state.number+1
//     })
//     this.setState({
//       number:this.state.number+1
//     })
//     // // 在这个方法结束之后进行批量更新
//     // updateQueue.batchUpdate()

//   }
//   render(){
//     return <div>
//       <p>{this.props.title}</p>
//       <p>{this.state.number}</p>
//       <button onClick={this.handleClick}>+</button>
//     </div>
//   }

// }

// ReactDOM.render(<Counter title="定时器" />,document.getElementById('root'))



import React from "./react"
import ReactDOM from './react-dom'

class Counter extends React.Component{
  constructor(props){
    super(props)
  }


  counter=()=>{
    console.log('counter')
  }

  render(){
    return <>Counter</>
  }
}

function Fun(props,ref){
  return <div ref={ref}>Fun</div>
}

const ForwardFunc=React.forwardRef(Fun)


class Sum extends React.Component{
  a
  b
  result
  constructor(props){
    super(props)
    this.props=props
    this.a=React.createRef()//{current:null}
    this.b=React.createRef()//{current:null}
    this.result=React.createRef()
    
    this.c=React.createRef()
    this.func=React.createRef()

  }

  handleClick=()=>{
    let valueA=this.a.current.value;
    let valueB=this.b.current.value;
    this.result.current.value=valueA+valueB

    console.log(this.func,'this.func')

  }

  render(){
    return <>
    <ForwardFunc ref={this.func} />
    <Counter ref={this.c} />
    <input ref={this.a}/>+<input ref={this.b} /><button onClick={this.handleClick}>=</button><input ref={this.result} />
    </>
  }
}


ReactDOM.render(<Sum />,document.getElementById('root'))
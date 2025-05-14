import React from "./react"
import ReactDOM from './react-dom'

console.log(React.Fragment,'^^^^^^^^^^6')

class Counter extends React.Component{
  constructor(props){
    super(props)
    this.state={
      list:['A','B','C','D','E','F']
    }

  }

  handleClick=(event)=>{
    this.setState({
      list:['A','C','E','B','G']
    })

  }

  render(){
    return <React.Fragment>
      <ui>
        {
          this.state.list.map(item=><li key={item}>{item}</li>)
        }
      </ui>
      <button onClick={this.handleClick}>+</button>
    </React.Fragment>
  }
}


ReactDOM.render(<Counter />,document.getElementById('root'))
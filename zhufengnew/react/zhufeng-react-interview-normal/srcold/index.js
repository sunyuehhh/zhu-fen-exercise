import React from "react";
import ReactDOM from 'react-dom'

class App extends React.Component{
  state={
    list:new Array(10000).fill(0)
  }
  add=()=>{
    this.setState({list:[...this.state.list,1]})
  }
  render(){
    return (
      <ui>
        <input />
        <button onClick={this.add}>add</button>
        {
          this.state.list.map((item,index)=><li key={index}>{item}</li>)
        }
      </ui>
    )
  }
}
// 同步的写法 现在cra还是同步
// ReactDOM.render(<App />,document.getElementById('root'))
ReactDOM.unstable_batchedUpdates(document.getElementById('root')).render(<App />)
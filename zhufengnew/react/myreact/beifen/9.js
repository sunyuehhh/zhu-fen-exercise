import React from "./react"
import ReactDOM from './react-dom'

const loading=message=>OldComponent=>{
  return class extends React.Component{
    render(){
      const state={
        show:()=>{
          console.log('show')

        },
        hide:()=>{
          console.log('hide')

        }
      }

      return <OldComponent {...this.props} {...state}></OldComponent>
    }
  }
}

class Hello extends React.Component{
  render(){
    return <div>
      hello
      <button onClick={this.props.show}>show</button>
      <button onClick={this.props.hide}>hide</button>
    </div>
  }
}

const LoadingHello=loading('正在加载')(Hello)


ReactDOM.render(<LoadingHello />,document.getElementById('root'))
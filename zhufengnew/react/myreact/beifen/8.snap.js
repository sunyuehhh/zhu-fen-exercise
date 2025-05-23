import React from "./react"
import ReactDOM from './react-dom'

class ScrollList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      messages:[]
    }

    this.container=React.createRef()

  }

  addMessage=()=>{
    this.setState({
      messages:[`${this.state.messages.length}`,...this.state.messages]
    })
  }

  componentDidMount(){
    this.timerID=setInterval(()=>{
      this.addMessage()
    },1000)
  }

  componentWillUnmount(){
    clearInterval(this.timerID)
  }
  getSnapshotBeforeUpdate(){
    return {
      preScrollTop:this.container.current.scrollTop,
      prevScrollHeight:this.container.current.scrollHeight
    }
  }

  componentDidUpdate(prevProps,prevState,{
    preScrollTop,
    prevScrollHeight
  }){
    this.container.current.scrollTop=preScrollTop+(this.container.current.scrollHeight-prevScrollHeight)
    

  }

  render(){
    const style={
      height:'100px',
      width:'200px',
      border:'1px solid red',
      overflow:'auto'
    }
    return <div style={style} ref={this.container}>
      {
        this.state.messages.map((message,index)=>(
          <div key={index}>{message}</div>
        ))
      }
    </div>
  }
}



ReactDOM.render(<ScrollList />,document.getElementById('root'))
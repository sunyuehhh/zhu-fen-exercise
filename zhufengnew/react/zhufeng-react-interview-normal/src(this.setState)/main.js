import React from "react";
import ReactDOM from 'react-dom'
// import Counter from './Counter'
import { NoMode,ConcurrentMode } from "./ReactFiberWorkLoop";
import { HostRoot,ClassComponent } from "./ReactWorkTags";
import {Component} from './ReactBaseClasses'
import { batchedUpdates } from "./ReactFiberWorkLoop";

class Counter extends Component{
  state={
    number:0
  }
  handleClick=(event)=>{
    this.setState({
      number:this.state.number+1
    })

    console.log('setState1',this.state)
        this.setState({
      number:this.state.number+1
    })

    console.log('setState2',this.state)

    setTimeout(()=>{
          this.setState({
      number:this.state.number+1
    })

    console.log('setState3',this.state)
        this.setState({
      number:this.state.number+1
    })

    console.log('setState4',this.state)
    },0)

  }

  render(){
    console.log('render')
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}></button>
      </div>
    )
  }
}

// ReactDOM.render(<Counter />,document.getElementById('root'))
let counterInstance = new Counter();
let mode=NoMode;
// 根fiber的mode会影响下面所有的子Fiber
// 每个Fiber会有一个updateQueue代表更新队列  源码里是个链表
let rootFiber={
  tag:HostRoot,
  updateQueue:[],
  mode

}

let counterFiber={
  tag:ClassComponent,
  updateQueue:[],
  mode
}
// fiber的stateNode指向类的实例
counterFiber.stateNode=counterInstance
// _reactInternal指定这个组件实例对应的Fiber
counterInstance._reactInternals=counterFiber
// rootFiber第一个儿子 或者说大儿子是counterFiber
rootFiber.child=counterFiber
counterFiber.return=rootFiber



// 合成时间 React17以后其实事件委托给容器了
document.addEventListener('click',(event)=>{
  let syntheticEvent={
    nativeEvent:event
  }//根据原生事件创建合成事件  
  // 源码里先通过事件  找到事件源  再通过事件源到对应处理函数
  batchedUpdates(()=> counterInstance.handleClick(syntheticEvent))




})
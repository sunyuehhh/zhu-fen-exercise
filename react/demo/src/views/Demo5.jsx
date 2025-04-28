import React from "react"
import { flushSync } from "react-dom"
// flushSync:可以刷新"updater更新队列"，也就是让修改状态的仍无立即批处理一次！！！！！！
// this.setState(preState=>{
  // preState存储的是之前的状态值  return的对象，就是我们想要修改的新状态值[支持修改部分状态]
//  return {xx:xx}
// })  函数
class Demo extends React.Component{
    state={
        x:0,
    }

    handle=()=>{
      for(let i=0;i<20;i++){
        this.setState(preState=>{
          return {
            x:preState.x+1
          }
        })
      }
    }
    render(){
        console.log('视图渲染：RENDER')
        let {x}=this.state


        return <div>
            {x}
            <br>
            </br>
            <button onClick={this.handle}>按钮</button>
        </div>
    }

}


export default Demo
/**
 * this.setState(partialState,callback)
 * partialState:支持部分状态更改
 * this.setState({
 * x:100 //不论总共有多少状态，我们只修改了x，其余的状态不动
 * })
 * callback:在状态更改，视图更新完毕之后触发执行[也可以说只要执行了setState,callback一定执行]
 * 发生在componentDidUpdate周期函数之后  [DidUpdate会在任何状态更改后都触发执行；
 * 而回调函数方式，可以在指定状态更新后处理一些事情]
 * !!!!!!!!!!!!!!特殊：即使我们基于shouldComponentUpdate阻止了状态/视图更新，didUpdate周期函数肯定不会执行了，
 * 但是我们设置的这个callback回调函数依然会被触发执行
 * 
 */
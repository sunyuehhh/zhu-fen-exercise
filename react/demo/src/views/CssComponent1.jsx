/**
 * React高阶组件：利用JS中的闭包  [柯里化函数]  实现的组件代理
 */

import React from "react";

const Demo = function Demo(props){
  return <div className="demo">
    我是DEMO
    {props.x}
  </div>
}

// 执行ProxyTest方法，传递一个组件进来
const ProxyTest=function ProxyTest(Component){
  // Component->Demo
  return function HOC(props){
    return <Component {...props}></Component>
  }
} 

export default ProxyTest(Demo)
// 把函数执行的返回结果[应该是一个组件]，基于ESModule规范导出，供App导入使用！
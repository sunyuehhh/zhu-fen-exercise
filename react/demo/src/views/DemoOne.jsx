import PropTypes from "prop-types"
import React from "react"
const DemoOne=function DemoOne(props){
  let {className,style,title,children}=props
  // 可以基于React.children对象中提供的方法，对props.children做处理:count\forEach\toArray\map
  // 好处：在这些方法的内部，已经对children的各种形式做了处理
  // React.Children.forEach(children,()=>{})
  children=React.Children.toArray(children)
  let headerSlot=[],footerSlot=[],defaultSlot=[];
  children.forEach(child=>{
    // 传递进来的插槽信息，都是编译为virtualDOM后传递进来的，而不是传递的标签
    let {slot}=child.props
    if(slot=='header'){
      headerSlot.push(child)
    }else if(slot=='footer'){
      footerSlot.push(child)
    }else{
      defaultSlot.push(child)
    }
  })
  return <div className={className} style={style}>
    {headerSlot}
    <h2 className="title">{title}</h2>
    {footerSlot}
  </div>

}

/**
 * 设置静态的私有属性方法[把函数当作对象，来给其设置属性的规则]
 */
DemoOne.defaultProps={
  x:0
}
DemoOne.propTypes={
  title:PropTypes.string.isRequired,
  x:PropTypes.number
}

export default DemoOne
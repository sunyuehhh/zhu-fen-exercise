import React,{useState} from "react";
import { Button } from "antd";
import { flushSync } from "react-dom";

const Demo=function Demo(props){
    console.log('RENDER渲染')
    // 我们需要把基于属性传进来的x/y,相加后(或者经过其他处理)的结果作为初始值
    // let {x,y}=props,total=0;
    // for(let i=x;i<=y;i++){
    //   total+=+String(Math.random()).substring(2)
    // }
    let [num,setNum]=useState(()=>{
      let {x,y}=props,total=0;
      for(let i=x;i<=y;i++){
        total+=+String(Math.random()).substring(2)
      }

      return total
    });

    const handle=(type)=>{
      setNum(1000)
    }

    return <div className="demo">
        <h2>{props.title}</h2>
        <span className="num">num:{num}</span>
        <Button type="primary" size="small" onClick={handle}>反对</Button>
    </div>
}
export default Demo
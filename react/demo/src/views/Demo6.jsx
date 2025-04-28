import React,{useState,useEffect} from "react";
import { Button } from "antd";

const Demo=function Demo(props){
    console.log('RENDER渲染')
    let [num,setNum]=useState(0),
    [x,setX]=useState(100)

    useEffect(()=>{
      // 获取最新的状态值1
      console.log('@1')
    })

    useEffect(()=>{
      // 获取最新的状态值
      console.log('@2')
    },[])

    useEffect(()=>{
      // 获取最新的状态值
      console.log('@3',num)
    },[num])

    useEffect(()=>{
      return ()=>{
        console.log('@4')
      }
    })

    const handle=(type)=>{
      setNum(num+1)
    }

    return <div className="demo">
        <h2>{props.title}</h2>
        <span className="num">num:{num}</span>
        <Button type="primary" size="small" onClick={handle}>新增</Button>
    </div>
}
export default Demo
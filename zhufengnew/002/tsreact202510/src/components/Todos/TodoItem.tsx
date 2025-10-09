import React,{ReactNode,PropsWithChildren,ReactElement} from 'react'
import { Todo } from '../../module/todos'

interface Props{
  todo:Todo
}


const todoItemStyle:React.CSSProperties={
  color:'red',
  backgroundColor:'green'
}

const TodoItem:React.FC<Props>=(props:Props)=>(
  <li style={todoItemStyle}>{props.todo.text}</li>
)



export default TodoItem


// type FC<P={}>=FunctionComponent<P>
// interface FunctionComponent<P={}>{
//   (props:PropsWithChildren<P>,context?:any):ReactElement<any,any>|null;
//   defaultProps?:Partial<P>

// }
import React,{ReactNode} from 'react';
import { Todo } from '../../module/todos';
import { WithDefaultProps,DefaultProps } from '@/util';





interface OwnProps{
  addTodo:(todo:Todo)=>void
}
type Props=OwnProps&DefaultProps

interface State{
  text:string
}


let id=0
 class TodoInput extends React.Component<Props,State>{
  constructor(props:Props){
    super(props)
    this.state={text:''}
  }

  handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    this.setState({
      text:event.target.value
    })

  }
  handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
    let text=this.state.text.trim()
    if(!text) return
    this.props.addTodo({id:id++,text})
    this.setState({
      text:''
    })

  }

  public render() {
    const {text}=this.state
    const {settings}=this.props as Props
    const {handleSubmit,handleChange}=this
    return (
      <form onSubmit={handleSubmit}>
        <input maxLength={settings?.maxLength} placeholder={settings?.placeholder} value={this.state.text} onChange={handleChange} />
        <button type="submit">添加</button>
      </form>
    )
  }
}


export default WithDefaultProps(TodoInput)
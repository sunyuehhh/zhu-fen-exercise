import React,{ReactNode} from 'react';
import { Todo } from '../../module/todos';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import { connect } from 'react-redux'
import * as actions from '@/store/actions/todo'
import { CombinedState,TodoState } from '@/store/reducers'


type Props=TodoState&typeof actions

interface State{
  todos:Array<Todo>
}

class Todos extends React.Component<Props,State>{
  render(): ReactNode {
    const {addTodo,list}=this.props
    return (
      <div>
        <TodoInput addTodo={addTodo} />
        <ul>
          {
            list.map(todo=>(
              <TodoItem todo={todo} key={todo.id}></TodoItem>
            ))
          }
        </ul>
      </div>
    )
  }

}


const mapStateToProps=(state:CombinedState):TodoState=>state.todo

export default connect(
  mapStateToProps,
  actions
)(Todos)
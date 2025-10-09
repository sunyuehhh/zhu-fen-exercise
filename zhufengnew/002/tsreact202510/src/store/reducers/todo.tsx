import { ADD_TODO } from '@/action-types';
import { TodoAction } from '../actions/todo';
import { Todo } from '@/module/todos';
export interface TodoState{
  list:Array<Todo>
}

let initialState:TodoState={
  list:new Array<Todo>()
}

export default function(state:TodoState=initialState,action:TodoAction):TodoState{
  switch(action.type){
    case ADD_TODO:
      return {
        list:[...state.list,action.payload]//action
      }
    default:
      return state
  }

}
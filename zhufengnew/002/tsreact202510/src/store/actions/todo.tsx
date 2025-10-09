import {ADD_TODO} from '@/action-types'
import { Todo } from '@/module/todos'

export function addTodo(todo:Todo){
  return {
    type:ADD_TODO,
    payload:todo
  }
}

export type TodoAction=ReturnType<typeof addTodo>
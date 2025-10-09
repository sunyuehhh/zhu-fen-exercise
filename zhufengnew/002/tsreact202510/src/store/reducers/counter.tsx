import { ADD,MINIS } from '@/action-types';
import { CounterAction } from '@/store/actions/counter';
export interface CounterState{
  count:number
}

let initialState:CounterState={count:0}

export default function(state:CounterState=initialState,action:CounterAction):CounterState{
  switch(action.type){
    case ADD:
      return {
        count:state.count+1
      }
    case MINIS:
      return {
        count:state.count-1
      }
    default:
      return state
  }

}
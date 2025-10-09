import counter,{CounterState} from './counter';
import todo,{TodoState} from './todo';

import { combineReducers } from 'redux';
let reducers={
  counter,
  todo
}

type ReducersType=typeof reducers;
// 合并后的状态类型
type CombinedState={
  [K in keyof ReducersType]:ReturnType<ReducersType[K]>
}

export type {CombinedState,CounterState,TodoState}
let combinedReducer=combineReducers(reducers)
export default combinedReducer
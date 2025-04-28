import _ from 'lodash'
import { PERSONAL_INFO } from '../action-types';
// Vote模块下的reducer
const initial={
  num:100,
  info:null
}

export default function personalReducer(state=initial,action){
  state=_.clone(state)
  switch(action.type){
    case PERSONAL_INFO:
      state.info=action.payload;
      break;
    default:
    
  }




  return state

}
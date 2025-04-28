import _ from 'lodash'
import { VOTE_OPP,VOTE_SUP } from '../action-types'
// Vote模块下的reducer
const initial={
  supNum:10,
  oppNum:5,
  num:0

}

export default function voteReducer(state=initial,action){
  state=_.clone(state)
  switch(action.type){
    case VOTE_SUP:
      state.supNum++
      break
    case VOTE_OPP:
      state.oppNum++
      break
    default:
  }
  return state

}
import {ADD,MINIS} from '@/action-types'

export function add(){
  return {
    type:ADD
  }
}

export function minus(){
  return {
    type:MINIS
  }
}

export type CounterAction=ReturnType<typeof add>|ReturnType<typeof minus>
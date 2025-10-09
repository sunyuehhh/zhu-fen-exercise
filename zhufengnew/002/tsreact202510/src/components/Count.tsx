import * as React from 'react'
import { CombinedState,CounterState } from '@/store/reducers'
import { add,minus } from '@/store/actions/counter'
import { connect } from 'react-redux'
import * as actions from '@/store/actions/counter'
// const actions={add,minus}
type Props=CounterState&typeof actions
class Counter extends React.Component<Props>{
  render(){
    const {count,add,minus}=this.props
    return (
      <div>
        <p>{count}</p>
        <button onClick={add}>+</button>
        <button onClick={minus}>-</button>
      </div>
    )
  }
}

const mapStateToProps=(state:CombinedState):CounterState=>state.counter

export default connect(
  mapStateToProps,
  actions
)(Counter)
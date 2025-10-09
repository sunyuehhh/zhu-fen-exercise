import * as React from 'react'
interface Props{
  number:number
}
export default class Counter extends React.Component<Props>{
  render(){
    const {number}=this.props
    return (
      <div>
        <p>{number}</p>
      </div>
    )
  }
}
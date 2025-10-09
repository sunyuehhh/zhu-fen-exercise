import React from 'react';
import HoistNonReactStatics from 'hoist-non-react-statics'

let defaultProps={
  settings:{
    maxLength:6,
    placeholder:'请输入待办事项'
  }
}

export type DefaultProps=Partial<typeof defaultProps>


export const WithDefaultProps=<P extends DefaultProps>(OldComponent:React.ComponentType<P>)=>{
  type OwnProps=Omit<P,keyof DefaultProps>
  class NewComponent extends React.Component<OwnProps>{
    render(){
      let props={...defaultProps,...this.props} as P;
      return <OldComponent {...props}/>
    }

  }

  return HoistNonReactStatics(NewComponent,OldComponent)

}
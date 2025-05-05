import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, DatePicker } from 'antd';


function IndexPage({num,loading,dispatch}) {
  loading=loading.effects['demo/incrementAsync']

  return (
    <div>
      demo
      {num}
      <Button onClick={()=>{
        dispatch({
          type:'demo/increment',
          payload:5
        })
      }}>同步按钮</Button>

      <Button loading={loading} onClick={ ()=>{

         dispatch({
          type:'demo/incrementAsync',
          payload:10
        })
      }}>异步按钮</Button>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect(state=>(
  {
    ...state.demo,
    loading:state.loading
  }
))(IndexPage);

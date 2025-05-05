import React from 'react';
import { Button, DatePicker } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

/**
 * routerRedux式react-router-redux中提供的对象，此对象中包含了路由跳转的方法
 * +go/goBack/goForward
 * +push/replace
 * 相比较于props.history对象来讲，routerRedux不仅可以在组件中实现路由跳转，而且可以在redux操作中实现路由跳转
 * 它本身就是redux和router的结合操作
 * 
 * 在redux内部
 * yield routerRedux.push(...)
 * 
 * 在redux外部[或者组件中]
 * dispatch(
 * routerRedux.push(...)
 * )
 * 
 */

function IndexPage({dispatch}) {
  return (
    <div>
      MyOrder

      <Button type='primary' onClick={()=>{
        dispatch(routerRedux.push('/demo'))

      }}>按钮</Button>

      
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);

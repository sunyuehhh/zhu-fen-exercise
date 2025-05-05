import React from 'react';
import { connect } from 'dva';
import { Button, DatePicker } from 'antd';
import dynamic from 'dva/dynamic';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'; // ✅ 用 react-router-dom 提供的 Switch！

import { LevelTwoRouterConfig } from '../router';

// const LazyOrder = dynamic({
//   app: window.app,
//   models: () => [],
//   component: () => import(/* webpackChunkName: "personal" */ './MyOrder'),
// });

function IndexPage() {
  return (
    <div>
      <div className='menu'>
        <NavLink to="/personal/order">我的订单</NavLink>
      </div>
      <div className='content'>
        {/* <Switch>
          <Route exact path="/personal" render={() => <Redirect to="/personal/order" />} />
          <Route path="/personal/order" component={LazyOrder} />
        </Switch> */}
        {
          <LevelTwoRouterConfig path="/personal"></LevelTwoRouterConfig>
        }
      </div>
    </div>
  );
}

export default connect()(IndexPage);

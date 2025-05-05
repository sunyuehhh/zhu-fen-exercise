import React from 'react';
import { Router, Route, Switch,Redirect } from 'dva/router';
import IndexPage from './routes/IndexPage';
import dynamic from 'dva/dynamic'

// ANTD
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './index.less'

import routes from './routerRoutes';



// 动态路由
// 根据路由表，动态创建路由匹配机制
const Element=function Element(props){
  let {component:Component,history,location,match}=props

  return <Component history={history} location={location} match={match}  />

}
const createRoute=routes=>{
  return <Switch>
    {
      routes.map((item,index)=>{
        let {path,exact,component,meta,redirect}=item,
        config={};
        // 重定向
        if(redirect){
          config={
            from:path,
            to:redirect
          }
          if(exact) config.exact=exact
          return <Redirect key={index} {...config}/>
        }

        // 正常路由
        config={
          path
        }
        if(exact) config.exact=exact
        return <Route key={index} {...config} render={props=>{
          console.log(props,'Element props')
          // 1.修改页面的TITLE
          let title=meta.title||'';
          document.title=title;

          // 2.不要直接渲染指定的组件，统一渲染Element,在这个组件中，可以做更复杂的操作[例如:登录态校验]

          return <Element {...props} {...item} />


        }} />

      })
    }
  </Switch>

}


/**
 * history:包含路由跳转方法的history对象
 * app:基于dva出啊关键的应用
 * 
 * 基于dva/dynamic实现路由懒加载，懒加载了组件及对应的Models
 */
function RouterConfig({ history,app }) {
  console.log(history,app,'history')
  return (
    <ConfigProvider locale={zhCN}>
    <Router history={history}>
      {createRoute(routes)}
    </Router>
    </ConfigProvider>
  );
}

export default RouterConfig;


// 二级路由
export const LevelTwoRouterConfig=function LevelTwoRouterConfig({path}){
  // 根据path去一级路由中筛选，查找对应的二级路由
  let item=routes.find(item=>item.path===path),
  children=item.children||null;
  if(!children) return null
  return createRoute(children)
}

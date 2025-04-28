import { Navigate } from "react-router";
import A from '../views/A'
import { lazy } from "react";

// A板块的二级路由
const aRoutes=[
  {
    path:'/a',
    component:()=><Navigate to="/a/c" />
  },
  {
    path:'/a/c',
    name:'a-c',
    component:lazy(()=>import(/*webpackChunkName:"AChild"*/'../views/C'))
  }
]

// 配置路由表:数组   数组中每一项就是每一个需要配置的路由规则
const routes=[
  {
    path:'/',
    component:()=><Navigate to="/a" />
    
  },
  {
    path:'/a',
    name:'a',
    component:A,
    meta:{

    },
    children:aRoutes

  },
  {
    path:'/b',
    name:'b',
    component:lazy(()=>import('../views/B')),
    meta:{}
  },
  {
    path:'*',
    component:()=><Navigate to={{
      pathname:'/a',
      search:'?from=404'
    }} />
  }
];



export default routes;
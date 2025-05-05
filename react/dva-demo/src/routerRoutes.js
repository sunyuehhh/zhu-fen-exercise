import IndexPage from "./routes/IndexPage";
import dynamic from "dva/dynamic";

// 路由懒加载
const lazy=function lazy(component,models){
  if(typeof models==='undefined') models=()=>[];
  return dynamic({
    app:window.app,
    models,
    component
  })
}


// 配置路由表
const routes=[{
  path:'/',
  exact:true,
  component:IndexPage,
  meta:{
    title:'首页'
  }
},{
  path:'/demo',
  component:lazy(
    ()=>import('./routes/Demo'),
    ()=>[import('./models/demoModel')]
  ),
  meta:{
    title:'测试页'
  },
  
},{
  path:'/personal',
  component:lazy(
    ()=>import('./routes/Personal')
  ),
  meta:{
    title:'个人中心'
  },
  // 二级路由
  children:[{
    path:'/personal',
    exact:true,
    redirect:'/personal/order'
  },{
    path:'/personal/order',
    component:lazy(()=>import('./routes/MyOrder')),
    meta:{
      title:'个人中心/我的订单'
    }

  }]
},
{
  path:'*',
  redirect:'/'
}];
export default routes;
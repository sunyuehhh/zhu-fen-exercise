import { computed, reactive, shallowRef, unref } from "vue";
import { createWebHashHistory } from "./history/hash";
import { createWebHistory } from "./history/html5";
import {RouterLink} from './router-link'
import { RouterView } from "./router-view";


function normalizeRouteRecord(record){//创建匹配记录
  return {
    path:record.path,//状态机  解析路径  算出匹配规则
    meta:record.meta||{},
    beforeEnter:record.beforeEnter,
    name:record.name,
    components:{
      default:record.component//循环
    },
    children:record.children||[]
  }
}

function createRouteRecordMatcher(record,parent){//构建父子关系
  // record中得path做一些修正  正则得情况
  const matcher={
    path:record.path,
    record,
    parent,
    children:[]
  }

  if(parent){
    parent.children.push(matcher)
  }
  
  return matcher
}

function createRouterMatcher(routes){

  const matchers=[]

  function addRoute(route,parent){
    let normalizedRecord=normalizeRouteRecord(route)

    if(parent){
      normalizedRecord.path=parent.path+normalizedRecord.path
    }

    const matcher=createRouteRecordMatcher(normalizedRecord,parent)
    if('children' in normalizedRecord){
      let children=normalizedRecord.children
      for(let i=0;i<children.length;i++){
        addRoute(children[i],matcher)
      }

    }

    matchers.push(matcher)

  }

  routes.forEach(route => {
   addRoute(route)
  });


  function resolve(location){//{path:/,matched:HomeRecord}
    const matched=[]
    let path=location.path
    let matcher=matchers.find(m=>m.path===path)

    while(matcher){
      matched.unshift(matcher.record)
      matcher=matcher.parent
    }

    return {
      path,
      matched
    }
  }


  return {
    resolve,
    addRoute //动态得添加路由  面试问路由  如何动态添加  就是这个api
  }


}


const START_LOCATION_NORMALIZED={//初始化路由系统中得默认参数
  path:'/',
  matched:[],//当前路径匹配到得记录

}



function createRouter(options){
  console.log(options,'options')
  // 格式化路由得配置  拍平
  const routerHistory=options.history;
  console.log(options.routes,routerHistory)

  const matcher=createRouterMatcher(options.routes)

  console.log(matcher,'matcher')

  // 后续改变这个数据得value  就可以更新视图
  const currentRoute=shallowRef(START_LOCATION_NORMALIZED);//obj.value=响应式数据
  // 将数据用计算属性   再次包裹

  function resolve(to){//to="/"  to={path:'/'}
    if(typeof to==='string'){
     return matcher.resolve({path:to})
    }

  }


  let ready;
  function markAsReady(){
    if(ready) return
    ready=true


    routerHistory.listen((to)=>{
      const targetLocation=resolve(to)
      const from=currentRoute.value
      finalizeNavigation(targetLocation,from,true)

    })

  }

  function finalizeNavigation(to,from,replaced){
    if(from===START_LOCATION_NORMALIZED||replaced){
      routerHistory.replace(to.path)
    }else{
      routerHistory.push(to.path)
    }

    currentRoute.value=to;//更新最新得路径


    markAsReady()
    // 如果是初始化  我们还需要注入一个listen 去更新currentRoute得值 这样数据变化后可以重新渲染视图
  }


  function pushWithRedirect(to){//通过路径匹配到对应得记录  更新currentRoute
    const targetLocation=resolve(to)
    const from=currentRoute.value

    console.log(targetLocation,from,'&&&&&&')

    finalizeNavigation(targetLocation,from)
    // 根据是不是第一次 来决定是push  还是replace

  }

function push(to){
  return pushWithRedirect(to)
}
  

  const router={
    push,
    replace(){},

    install(app){//路由得核心就是  页面切换  重新渲染
      const router=this
      app.config.globalProperties.$router=router
      Object.defineProperty(app.config.globalProperties,'$route',{
        enumerable:true,
        get:()=>unref(currentRoute)
      })
      console.log(app)

      
  const reactiveRoute={}

  for(let key in START_LOCATION_NORMALIZED){
    reactiveRoute[key]=computed(()=>currentRoute.value[key])
  }

  app.provide('router',router)
  app.provide('route location',reactive(reactiveRoute))


      app.component('RouterLink',RouterLink)


      app.component('RouterView',RouterView)
      


      // 
      if(currentRoute.value==START_LOCATION_NORMALIZED){
        // 默认就是初始化  需要通过路由系统进行一次跳转  发生匹配
        push(routerHistory.location)
      }

      // 后续还有逻辑
      // 解析路径   RouterLink  RouterView实现  页面得钩子  从离开到进入  到解析完成

    }
  }


  return router
}


export {
  createWebHashHistory,
  createWebHistory,
  createRouter
}
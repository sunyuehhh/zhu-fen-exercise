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


function useCallback(){
  const handlers=[]
  function add(handler){
    handlers.push(handler)


  }

  return {
    add,
    list:()=>handlers
  }

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



  // 全局钩子
  const beforeGuards=useCallback()
  const beforeResolveGuards=useCallback()
  const afterGuards=useCallback()

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


  function extractChangeRecords(to,from){
    const leavingRecords=[]
    const updatingRecords=[]
    const enteringRecords=[]
    
    for(let i=0;i<length;i++){
      const recordFrom=from.matched[i]
      if(recordFrom){
        // 去得和来的都有  那么就是要更新
        if(to.matched.find(record=>record.path==recordFrom.path)){
          updatingRecords.push(recordFrom)
        }else{
          leavingRecords.push(recordFrom)
        }
      }

      const recordTo=to.matched[i]
      if(recordTo){
        if(!from.matched.find(record=>record.path===recordTo.path)){
          enteringRecords.push(recordTo)
        }

      }
    }

    return [leavingRecords,updatingRecords,enteringRecords]
  }


  function guardToPromise(guard,to,from,record){
    return ()=>new Promise((resolve)=>{
      const next=()=>resolve()

      const guardReturn=guard.call(record,to,from,next)//用户调next  这个promise就成功了

      // 如果不调用next 最终也会调用next  用户可以不调用next方法
      return Promise.resolve(guardReturn).then(next)


    })


  }

  function extractComponentsGuards(matched,guardType,to,from){
    const guards=[]
    for(const record of matched){
      let rawComponent=record.components.default
      const guard=rawComponent[guardType]

      // 我需要将钩子  全部串联再一起  promise
      guard&&guards.push(guardToPromise(guard,to,from,record))
    }

    return guards

  }


  // promise得组合函数
  // 按顺序执行  串联起来   [fn()=>promise,fn=>promise]
  function runGuardQueue(guards){
    return guards.reduce((promise,guard)=>promise.then(()=>guard()),Promise.resolve())

  }

  function navigate(to,from){
    // 再做导航得时候   我要知道哪个组件时进入  哪个组件时离开得  还要知道哪个组件时更新得

    const [leavingRecords,updateRecords,enteringRecords]=extractChangeRecords(to,from)

    // 我离开得时候  需要从后往前   /home/a  ->about
   let guards= extractComponentsGuards(leavingRecords.reverse(),
  'beforeRouteLeave',to,from)

  return runGuardQueue(guards).then(()=>{
    guards=[]
    for(const guard of beforeGuards.list()){
      guards.push(guardToPromise(guard,to,from,guard))
    }

    return runGuardQueue(guards)
  }).then(()=>{
    guards=extractComponentsGuards(leavingRecords,
  'beforeRouteUpdate',to,from)

  return runGuardQueue(guards)
  }).then(()=>{
    guards=[]

    for(const record of to.matched){
      if(record.beforeEnter){
      guards.push(guardToPromise(record.beforeEnter,to,from,record))
      }
    }

    return runGuardQueue(guards)
  }).then(()=>{
        guards=extractComponentsGuards(enteringRecords,
  'beforeRouteEnter',to,from)

  return runGuardQueue(guards)
  })

  }

  function pushWithRedirect(to){//通过路径匹配到对应得记录  更新currentRoute
    const targetLocation=resolve(to)
    const from=currentRoute.value

    // console.log(targetLocation,from,'&&&&&&')

    // finalizeNavigation(targetLocation,from)
    // // 根据是不是第一次 来决定是push  还是replace

    navigate(targetLocation,from).then(()=>{
      return finalizeNavigation(targetLocation,from)
    }).then(()=>{
      // 当导航切换完毕后执行afterEach
      for(const guard of afterGuards.list()) guard(to,from)
    })

  }

function push(to){
  return pushWithRedirect(to)
}
  

  const router={
    push,
    beforeEach:beforeGuards.add,
    afterEach:afterGuards.add,//可以注册多个  所以是一个发布订阅模式
    beforeResolve:beforeResolveGuards.add,
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
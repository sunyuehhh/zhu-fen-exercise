import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
// 入口文件  他需要提供vue实例
// 如果是服务端渲染  每个人都应该有一个自己的vue实例
export default ()=>{
  const router=createRouter()
  const app=new Vue({
    router,
    render:h=>h(App)
  })

  return {app,router}
}

import {createRouter,createWebHistory,createWebHashHistory} from '@/vue-router'
import HomeComponent from '../views/HomeComponent.vue'
import AboutComponent from '../views/AboutComponent.vue'

const routes=[
  {
    path:'/',
    name:'HomeComponent',
    component:HomeComponent
  },
  {
    path:'/about',
    name:'AboutComponent',
    component:AboutComponent
  }
]



const router=createRouter({
  history:createWebHistory(),
  routes
})


export default router
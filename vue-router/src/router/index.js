import VueRouter from './vue-router'
import Vue from 'vue'
import HomePage from '../views/HomePage.vue'
import AboutPage from '../views/AboutPage.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode:'hash',
  routes:[
    {
      path:'/home',
      component:HomePage
    },
    {
      path:'/about',
      component:AboutPage
    }
  ]
})
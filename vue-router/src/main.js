import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  name:'root-com',
  store,
  router,
  render: h => h(App),
}).$mount('#app')

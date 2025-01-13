// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  // 状态对象
  state: {
    count: 0
  },
  
  // 获取状态的方法（可选）
  getters: {
    doubleCount: state => state.count * 2+1
  },
  
  // 修改状态的方法
  mutations: {
    increment(state,payload) {
      setTimeout(()=>{
        state.count+=payload;
      },2000)

    },
    decrement(state) {
      state.count--;
    }
  },
  
  // 异步操作
  actions: {
    incrementAsync({ commit },payload) {
      setTimeout(() => {
        commit('increment',payload);
      }, 1000);
    }
  }
});

export default store;

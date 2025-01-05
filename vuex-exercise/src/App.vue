<template>
  <div id="app">
    {{this.$store.state.count}}
    <!-- {{this.$store.getters.doubleCount}} -->

    <button @click="add">点击</button>

  </div>
</template>

<script>


export default {
  name: 'App',
  mounted(){
    console.log(this.$store,'this.$store APP')
  },
  methods:{
    add(){
      this.$store.commit('increment',10)
      // this.$store.dispatch('incrementAsync',10)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
<h1>vue{{state.name}}</h1>
</template>

<script>
import { onMounted, reactive } from 'vue'
export default {
  name:'App',
  setup(){
    const state=reactive({
      name:'aaa'
    })
    onMounted(()=>{
      console.log('1111111111')
    })

    return {
      state
    }
  }
}
</script>

<style scoped>
h1{
  color:red;
}
</style>
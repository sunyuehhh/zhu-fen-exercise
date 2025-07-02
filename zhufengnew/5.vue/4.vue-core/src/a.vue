<template>
  <div class="a">
    {{msg}}
  </div>
</template>


<style scoped>
.a{
  background: red;
}

</style>

<script>
export default {
  data(){
    return {msg:'hello'}
  }
}
</script>
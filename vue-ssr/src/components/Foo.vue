<template>
  <div>Foo
    <button @click="clickMe">点击</button>
  </div>
</template>

<script>

export default{
  methods:{
    clickMe(){
      alert('点击')
    }
  }
}
</script>

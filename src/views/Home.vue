<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <button @click="cb">{{ btnName }}</button>
    <ul>
      <li v-for="(item, index) in list" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'this is an home page',
      btnName: '点我！',
      list: ['kobe', 'kidd', 'curry']
    }
  },
  name: 'home',
  methods: {
    cb() {
      alert('hello world')
    }
  }
}
</script>

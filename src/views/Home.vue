<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <button @click="cb">{{ btnName }}</button>
    <h3>created() 的时候创建</h3>
    <ul>
      <li v-for="(item, index) in list" :key="index">{{ item }}</li>
    </ul>
    <h3>mounted() 的时候创建</h3>
    <ul>
      <li v-for="(item, index) in list1" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'this is an home page',
      btnName: '点我！',
      list: [],
      list1: []
    }
  },
  name: 'home',
  methods: {
    cb() {
      alert('hello world')
    }
  },
  created() {
    console.log('created()')
    this.list = ['kobe', 'kidd', 'curry']
  },
  mounted() {
    console.log('mounted()')
    this.list1 = ['paul', 'james', 'carter']
  }
}
</script>
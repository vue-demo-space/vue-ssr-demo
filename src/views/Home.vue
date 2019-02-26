<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <button @click="cb">{{ btnName }}</button>
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="alertName(item)">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'this is an home page',
      btnName: '点我！',
    }
  },
  name: 'home',
  methods: {
    cb() {
      alert('hello world')
    },
    alertName(name) {
      alert(name)
    }
  },
  asyncData({ store, route }) {
    return store.dispatch('fetchList')
  },
  computed: {
    list() {
      return this.$store.state.list
    }
  }
}
</script>

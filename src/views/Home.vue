<template>
  <div class="home">
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  name: 'home',
  created() {
    fetch('http://api.anymusic.com/api/qq/search?keywords=%E6%9E%97%E4%BF%8A%E6%9D%B0&page=1')
      .then(res => res.json())
      .then(data => {
        this.list = data.data.songs
      })
  }
}
</script>

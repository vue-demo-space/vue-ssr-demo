import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      list: []
    },
    mutations: {
      setList(state, data) {
        state.list = data
      }
    },
    actions: {
      fetchList({ commit, state }) {
        return new Promise(resolve => {
          setTimeout(() => {
            console.log('开始获取数据')
            commit('setList', ['kobe', 'kidd', 'curry'])
            resolve()
          }, 1000)
        })
      }
    }
  })  
}

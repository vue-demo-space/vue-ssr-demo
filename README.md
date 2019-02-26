# vue-ssr-demo

## 说明

这个 demo 将实现带有异步请求的 vue ssr

根据 [vue ssr（不带异步请求）](https://github.com/vue-demo-space/vue-ssr-demo/tree/step-1) 演变而来，同样不带 dev 模式，原因看之前

```bash
# 部署
$ npm run build
$ npm run server
```

然后打开 <http://localhost:8080> 以及 <http://localhost:8080/about> 进行查看

代码中我们用 setTimeout 来模拟异步请求：

```js
// Home.vue 
asyncData({ store, route }) {
  return store.dispatch('fetchList')
}

// store.js
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
```

![](https://ws2.sinaimg.cn/large/006tKfTcly1g0jxzsu1yfj32420bsn2x.jpg)

可以看到 "异步请求" 得到的数据已经在页面上了

我们在 html 代码中看到了一个 `window.__INITIAL_STATE__` 的全局变量，**异步请求的数据其实是 node server 获取得到的**，然后渲染到 html 页面上，同时渲染页面的时候用 `window.__INITIAL_STATE__` 这个变量把数据传给客户端，作为 vue app 在客户端初始化的 state

可以看 store.js 文件：

```js
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
```

我尝试把这行代码去掉，发现前端页面无法渲染这个列表了，尽管 html 已经渲染了，我猜测是 vue app 初始化的时候，store.state.list 并不能获取到东西，所以页面上就空了

## 实现步骤

实现步骤参考文档 [这部分](https://ssr.vuejs.org/zh/guide/data.html#%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96%E5%AD%98%E5%82%A8%E5%AE%B9%E5%99%A8-data-store)，跟着文档一步步来就好来

说几个我认为的重点

我们将在路由组件上暴露出一个自定义静态函数 asyncData。注意，由于此函数会在组件实例化之前调用，所以它无法访问 this。需要将 store 和路由信息作为参数传递进去

在 entry-server.js 中，我们可以通过路由获得与 router.getMatchedComponents() 相匹配的组件，**如果组件暴露出 asyncData，我们就调用这个方法**。然后我们需要将解析完成的状态，附加到渲染上下文 (render context) 中。

当使用 template 时，context.state 将作为 `window.__INITIAL_STATE__` 状态，自动嵌入到最终的 HTML 中。而在客户端，在挂载到应用程序之前，store 就应该获取到状态：

```js
// entry-client.js

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
```

对于客户端数据预取，有两种方式：

1. 在路由导航之前解析数据
2. 匹配要渲染的视图后，再获取数据


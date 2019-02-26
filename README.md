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

我尝试把这行代码去掉，发现前端页面无法渲染这个列表了，尽管 html 已经渲染了，我猜测是 vue app 初始化的时候，store.state.list（没有初始化的数据）并不能获取到东西，所以页面上就空了

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

既然服务端已经执行了 asyncData 方法，异步获取了我们的数据，那是不是所有异步请求都是在服务端执行的呢？

不是的，以我们的 demo 为例，我们在 `/` 路由页面需要异步获取数据，为了体现 "异步"，我们将 setTimeout 设置了 3000ms。我们先直接打开 `/` 页面，node server 会执行这个异步，所以至少白屏 3000ms 后才会返回页面。如果我们先打开 `/about` 页面，然后再点击跳到 `/` 页面，这时候实际上是个 spa 单页应用，这个时候的异步请求是客户端发出的，这就是客户端数据预取

对于 [客户端数据预取](https://ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching)，有两种方式：

1. 在路由导航之前解析数据
2. 匹配要渲染的视图后，再获取数据

我们还是以先进入 `/about` 页面，后点击进入 `/` 页面为例。在路由导航之前解析数据，我们想要点击进入 `/` 页面，会在 `/about` 页继续停留 3000ms（这个时候页面展示的还是原来的页面，仿佛点击失效一般，可以做个 loading 效果），等数据取到后 **再渲染整个页面**；但是如果是匹配要渲染的视图后，再获取数据，是指先渲染 `/` 页面的其他部分，等 3000ms 后数据获取到后，再去渲染这部分

---

issue：

这里我们根据官方步骤处理后，在页面路由切换的时候代码有个报错：

![](https://ws1.sinaimg.cn/large/006tKfTcly1g0k2mybfbxj326u090425.jpg)

目前虽然有报错，但是不影响效果，定位到 **可能** 是 vuex-router-sync 的问题，[官方](https://github.com/vuejs/vuex-router-sync) 介绍它：

> Sync vue-router's current $route as part of vuex store's state.

查看 `/` 页面的 html 代码：

```js
window.__INITIAL_STATE__={"list":["kobe","kidd","curry"],"route":{"name":"home","path":"\u002F","hash":"","query":{},"params":{},"fullPath":"\u002F","meta":{},"from":{"name":null,"path":"\u002F","hash":"","query":{},"params":{},"fullPath":"\u002F","meta":{}}}}
```

我们把 vuex-router-sync 的使用取消后查看代码：

```js
window.__INITIAL_STATE__={"list":["kobe","kidd","curry"]}
```

我个人猜测它的作用可能是从 `/` 跳到 `/about` 然后再跳回 `/` 页面时，不会再去异步请求了

这个报错点以及疑问点还需要后续继续探索
# vue-ssr-demo

demo 总共实现三部分：

1. 一个简单的 vue spa（没有异步请求）- [代码](https://github.com/vue-demo-space/vue-ssr-demo/tree/step-0)
2. 一个简单的 vue ssr（没有异步请求）- [代码](https://github.com/vue-demo-space/vue-ssr-demo/tree/step-1)
3. 带有异步请求的 vue ssr - [代码](https://github.com/vue-demo-space/vue-ssr-demo/tree/step-2)

个人认为对于 ssr 的几个重要理解（可以类比 Nuxt）：

* 对于第一次打开的页面，实际上是 node 渲染的，之后的操作就是一个单页了
* ssr 依赖于 vue-server-renderer 这个库，该库能将 vue app 转成 html
* 同构就是客户端和服务端共用一套代码，vue 能够同构的前提是虚拟 dom
* 为什么要用 axios 这样能在客户端和服务端同时使用的库？因为 ssr 定义的 asyncData 方法可能会在服务端也可能在客户端执行，事实上，如果是在服务端执行，里面写一些跨域逻辑也是 ok 的（但是因为也要在客户端执行，所以 ...)
* 经常会在 ssr 的 html 页面看到 `window.__INITIAL_STATE__` 的定义，这是服务端在取到数据后传给客户端，客户端 store 将其初始化成 state。在挂载 (mount) 到客户端应用程序之前，需要获取到与服务器端应用程序完全相同的数据 - 否则，客户端应用程序会因为使用与服务器端应用程序不同的状态，然后导致混合失败

尚没有解决的问题：

* [ ] ssr 开发环境搭建
* [ ] ssr 异步数据获取 demo 浏览器有个报错（详见 [这里](https://github.com/vue-demo-space/vue-ssr-demo/tree/step-2) issue 部分）
* [ ] `/` 跳到 `/about` 再跳到 `/` 时，客户端是否还应该去做异步请求？后续参考下 Nuxt 的情况
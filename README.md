# vue-ssr-demo

## 说明

提供了一个简单的 vue ssr demo（不渲染异步请求数据）

demo 中包含 `/` 以及 `/about` 两个路由

**依然兼容 vue spa 模式：**

```bash
# 开发
$ npm run dev

# 部署
$ npm run build-client
```

**vue ssr 模式：**

```bash
# 部署
$ npm run build
$ npm run server
```

然后打开 <http://localhost:8080> 以及 <http://localhost:8080/about> 进行查看，右键源代码，可以看到数据已经被渲染到 html 上了

![](https://ws1.sinaimg.cn/large/006tKfTcly1g0juo7zau7j32520bs0xy.jpg)

vue ssr 模式并未做开发模式，原因下面说

## 实现步骤

一步步跟着 [教程](https://ssr.vuejs.org/zh/guide/)

安装 vue-server-renderer，简单地理解，这个包能将 vue 实例转为 html 代码，详见 [这里](https://ssr.vuejs.org/zh/guide/)

编写通用代码

> 在纯客户端应用程序 (client-only app) 中，每个用户会在他们各自的浏览器中使用新的应用程序实例。对于服务器端渲染，我们也希望如此：每个请求应该都是全新的、独立的应用程序实例，以便不会有交叉请求造成的状态污染 (cross-request state pollution)。

这大概也是同构的意思

我们将 app.js 修改成一个工厂函数，能在服务端和客户端都能被引用：

```js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'

export function createApp () {
  // 创建 router 实例
  const router = createRouter()
  const store = createStore()

  const app = new Vue({
    // 注入 router 到根 Vue 实例
    router,
    store,
    render: h => h(App)
  })

  // 返回 app 和 router
  return { app, router, store }
}
```

同时，router.js 和 store.js 也做相应修改

> 由于没有动态更新，所有的生命周期钩子函数中，只有 beforeCreate 和 created 会在服务器端渲染 (SSR) 过程中被调用。这就是说任何其他生命周期钩子函数中的代码（例如 beforeMount 或 mounted），只会在客户端执行。

以上这点在 demo 中我们可以看到，Home.vue 文件中 mounted 生命周期的内容并没有被渲染到 html 上，created 中的内容渲染上了

还有几个文件我们看看做了啥

entry-client.js 和之前的浏览器入口文件做的事差不多，无非是改成了用一个工厂函数去导出 vue 实例

entry-server.js 实现了服务器端的路由逻辑

server.js 是后端渲染的主逻辑，也是页面入口

接着看看 `npm run build` 命令做了啥。`npm run build-server` 生成了一个 vue-ssr-server-bundle.json 的文件，`npm run build-client` 在生成基础的 html、js 外，另外生成了一个 vue-ssr-client-manifest.json 文件（**该文件非必须**）

看看 server.js 的逻辑：

```js
const express = require('express')
const server = express()
const path = require('path')
const {
  createBundleRenderer
} = require('vue-server-renderer')

const serverBundle = require('./../dist/vue-ssr-server-bundle.json')
const clientManifest = require('./../dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template: require('fs').readFileSync(path.resolve(__dirname, './../dist/index.html'), 'utf-8'),
  clientManifest // （可选）客户端构建 manifest
})

// serve 静态资源
server.use(express.static(path.resolve(__dirname, './../dist/'), {index: false}))

server.get('*', (req, res) => {
  const context = { url: req.url }
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  renderer.renderToString(context, (err, html) => {
    // 处理异常……
    res.end(html)
  })
})

server.listen(8080)
```

这是一个典型的后端路由入口文件

index.html 页面跟 vue spa 的 index 页面并没有什么区别，只是多了个 `<!--vue-ssr-outlet-->` 来告诉 ssr server 这里放 ssr 出来的 html 内容。根据之前生成的 vue-ssr-server-bundle.json 以及 vue-ssr-client-manifest.json，便能生成 ssr 之后的 html，然后再塞到 `<!--vue-ssr-outlet-->` 区域

所以整个步骤是，当浏览器输入 <http://localhost:8080>，先进入 express server（事实上，新打开一个页面，肯定调用的是 express server），然后用 vue-server-renderer 去将 vue app 转为 html 代码，渲染到模板上，最后后端直出。之后如果在页面点击路由链接看起来就像是个 spa 了，但是直接打开链接（比如 <http://localhost:8080/about>），还是后端直出的

webpack 的配置详见 [这里](https://ssr.vuejs.org/zh/guide/build-config.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE-server-config)

---

最后说说为什么没有配置开发环境，因为试了下没成功

我的思路是用 webpack-dev-server 动态去生成 vue-ssr-server-bundle.json 和 vue-ssr-client-manifest.json 这两个文件，server 也起了，动态也能打开（localhost:xxxx/xx.json 形式），但是配置到 server.js 文件中死活不行，renderer.renderToString() 出不来结果，我也不知道怎么调试，只能作罢。而且这个方法对于 entry-client 和 entry-server 要起两个端口，express server 又一个端口，总共要起三个端口，另外静态文件的 serve 也要代理

另外还有另一种方式理论上可行，就是文件修改后直接 build，[vue-cli-ssr-example](https://github.com/eddyerburgh/vue-cli-ssr-example) 就是用了这个方法，可以参考下
# vue-ssr-demo

这个 demo 将逐步实现三个部分：

1. 一个简单的 vue spa（没有异步请求）
2. 一个简单的 vue ssr（没有异步请求）
3. 带有异步请求的 vue ssr

## 一个简单的 vue spa（没有异步请求）

[源码](https://github.com/vue-demo-space/vue-ssr-demo/tree/4251918dd2cdc2411e69cc264a516cbfba7d6ec7)

首先实现一个简单的 vue spa，这个非常简单，直接用 vue cli3 脚手架生成代码，删减了一些无用代码，简化 demo

demo 中包含 `/` 以及 `/about` 两个路由

```bash
# 开发 
$ npm run serve

# 打包
$ npm run build
```

打包后可以去 `/dist` 目录起 server 运行，需要注意的是，**无法直接打开 `/about` 页面**，这是正常的，线上运行的话还需要配置下，详见 [这里](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

## 一个简单的 vue ssr（没有异步请求）


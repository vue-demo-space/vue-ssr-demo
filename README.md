# vue-ssr-demo

提供了一个简单的 vue spa demo，demo 包含 `/` 以及 `/about` 两个页面

```bash
# 开发
$ npm run dev

# 打包
$ npm run build-client
```

打包后可以去 `/dist` 目录起 server 运行，需要注意的是，**无法直接打开 `/about` 页面**，这是正常的，线上运行的话还需要配置下，详见 [这里](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

几个注意点：

* 配置了 .bebelrc 文件是因为用了异步组件（详见 src/router.js 文件，About.vue 是异步引入的，根据控制台提示需要引入 @babel/plugin-syntax-dynamic-import）
* babel-loader 的配置，貌似既需要在 module.rules 里配置，也需要在 plugins 里配置，见 webpack.base.config.js 文件

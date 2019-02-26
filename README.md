# vue-ssr-demo

提供了一个简单的 vue spa demo，demo 包含 `/` 以及 `/about` 两个页面

```bash
# 开发
$ npm run dev

# 打包
$ npm run build-client
```

几个注意点：

* 配置了 .bebelrc 文件是因为用了异步组件（详见 src/router.js 文件，About.vue 是异步引入的，根据控制台提示需要引入 @babel/plugin-syntax-dynamic-import）
* babel-loader 的配置，貌似既需要在 module.rules 里配置，也需要在 plugins 里配置，见 webpack.base.config.js 文件
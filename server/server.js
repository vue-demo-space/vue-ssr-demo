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
  // clientManifest // （可选）客户端构建 manifest
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
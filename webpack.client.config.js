const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const base = require('./webpack.base.config.js')

module.exports = merge(base, {
  mode: process.env.NODE_ENV,
  entry: './src/entry-client.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    // 如果加了这个，html 里引用的 js 会是 /dist/xx.js，如果不加，就直接是 xx
    // publicPath: '/dist/',
    filename: 'entry-client.js'
  },
  devtool: '#eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
})

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new VueSSRClientPlugin()
  ])
}
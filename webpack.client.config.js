const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const base = require('./webpack.base.config.js')

module.exports = merge(base, {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    // 如果加了这个，html 里引用的 js 会是 /dist/xx.js，如果不加，就直接是 xx
    // publicPath: '/dist/',
    filename: 'app.js'
  },
  devtool: '#eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ]
})

if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production'
}
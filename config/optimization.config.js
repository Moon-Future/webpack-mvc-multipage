const OptimizeCss = require('optimize-css-assets-webpack-plugin') // 压缩css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false
    }),
    new OptimizeCss()
  ]
}
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
  ],
  // 提取公共文件
  splitChunks: {
    cacheGroups: {
      common: {
        name: 'common',
        chunks: 'all',
        minChunks: 2
      },
      vendor: {
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
        minChunks: 2
      }
    }
  }
}
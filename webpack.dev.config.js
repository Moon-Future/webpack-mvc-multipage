const { resolve } = require('path')

process.env.NODE_ENV = 'development'

module.exports = {
  mode: process.env.NODE_ENV,
  entry: resolve(__dirname, './config/entry.config.js'),
  output: resolve(__dirname, './config/output.config.js'),
  resolve: resolve(__dirname, './config/resolve.config.js'),
  plugins: resolve(__dirname, './config/plugins.config.js'),
  module: resolve(__dirname, './config/module.config.js')
}
const { resolve } = require('path')

process.env.NODE_ENV = 'development'

module.exports = {
  mode: process.env.NODE_ENV,
  devServer: require('./config/server.config.js'),
  optimization: require('./config/optimization.config.js'),
  entry: require('./config/entry.config.js'),
  output: require('./config/output.config.js'),
  resolve: require('./config/resolve.config.js'),
  plugins: require('./config/plugins.config.js'),
  module: require('./config/module.config.js')
}
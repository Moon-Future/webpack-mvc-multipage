const path = require('path')

module.exports = {
  port: 3000,
  progress: true,
  contentBase: path.resolve(__dirname, '../dist'),
  compress: true,
  hot: true
}
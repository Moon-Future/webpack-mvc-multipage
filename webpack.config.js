const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devServer: {
    port: 3000,
    progress: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  },
  mode: 'development', // production、development
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        // removeAttributeQuotes: true, // 删除双引号
        // collapseWhitespace: true // 折叠空白符
      },
      hash: true
    })
  ]
}
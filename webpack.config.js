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
  ],
  module: {
    rules: [
        /**
         * css-loader 解析 @import 语法
         * style-loader 把css插入的head的标签中
         */
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
    ]
  }
}
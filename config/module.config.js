const MiniCssExtractPlugin = require('mini-css-extract-plugin') // extracts CSS into separate files

module.exports = {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ]
        }
      }
    },
    {
      test: /\.ejs$/,
      loader: 'ejs-loader'
    },
    /**
     * postcss-loader 自动给样式增加浏览器前缀
     * css-loader 解析 @import 语法
     * style-loader 把css插入的head的标签中
     */
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader, 
        'css-loader',
        'postcss-loader'
      ]
    },
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }
  ]
}
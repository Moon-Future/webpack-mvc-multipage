const path = require('path')
const OptimizeCss = require('optimize-css-assets-webpack-plugin') // 压缩css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const pages = require('./webpack-config/entry.config.js')

console.log(pages)
// return;

module.exports = {
  devServer: {
    port: 3000,
    progress: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  },

  optimization: { // 优化项
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCss()
    ]
  },

  mode: 'production', // production、development

  entry: pages.entry,

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    // publicPath: '//ajs.lotpure.cn'
  },

  plugins: require('./webpack-config/plugins.config.js'),
  
  module: {
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
      /**
       * postcss-loader 自动给样式增加前缀
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
}
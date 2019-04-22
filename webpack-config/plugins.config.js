const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // extracts CSS into separate files
const htmlArr = require('./entry.config.js').htmlArr

let configPlugins = [
  new MiniCssExtractPlugin({
    filename: 'main.css'
  })
]

htmlArr.forEach((html) => {
  const htmlPlugin = new HtmlWebpackPlugin(html);
  configPlugins.push(htmlPlugin);
});

module.exports = configPlugins;
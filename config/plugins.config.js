const Wabpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // extracts CSS into separate files
const htmlArr = require('./entry.config.js').htmlArr

let configPlugins = [
  new MiniCssExtractPlugin({
    filename: 'main.css'
  }),
  new Wabpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': 'jquery'
  })
]

htmlArr.forEach((html) => {
  const htmlPlugin = new HtmlWebpackPlugin(html);
  configPlugins.push(htmlPlugin);
});

module.exports = configPlugins;
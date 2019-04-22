const fs = require('fs')
const glob = require('glob')

const pages = (entries => {
  let entry = {}, htmlArr = []
  // 格式化生成入口
  entries.forEach((file) => {
    const fileSplit = file.split('/')
    const length = fileSplit.length
    const filePath = fileSplit.slice(3, length).join('/')
    // let pageHtml = fileSplit.slice(1, length).join('/')
    // if ( !fs.existsSync(pageHtml) ) {
    //   // 入口如果不配置直接使用 _default.html
    //   pageHtml = fileSplit.slice(1, 2).join('/') + '/_default.html'
    // }
    pageHtml = fileSplit.slice(1, 2).join('/') + '/_main.ejs'
    entry[ 'ajs/' + filePath.split('.')[0]] = `./src/ajs/${filePath.split('.')[0]}.js`
    htmlArr.push({
      template: `./${pageHtml}`,
      filename: `${fileSplit.slice(3, length).join('/').split('.')[0]}.html`
    })
  })
  return {entry, htmlArr}
// })(glob.sync(resolve(__dirname, '../src/project/*/*.html')))
})(glob('./src/project/*/*.html', {sync: true}))

module.exports = pages;
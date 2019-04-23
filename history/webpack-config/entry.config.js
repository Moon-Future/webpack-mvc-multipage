const fs = require('fs')
const path = require('path')
const glob = require('glob')

const pages = (entries => {
  let entry = {}, htmlArr = []
  // 格式化生成入口
  entries.forEach((file, index) => {
    const fileSplit = file.split('/')
    const length = fileSplit.length
    const filePath = fileSplit.slice(3, length).join('/')
    // let pageHtml = fileSplit.slice(1, length).join('/')
    // if ( !fs.existsSync(pageHtml) ) {
    //   // 入口如果不配置直接使用 _default.html
    //   pageHtml = fileSplit.slice(1, 2).join('/') + '/_default.html'
    // }
    pageHtml = fileSplit.slice(1, 2).join('/') + '/_main.ejs'
    entry['ajs/' + filePath.split('.')[0]] = `./src/ajs/${filePath.split('.')[0]}.js`

    htmlArr.push({
      title: '标题',
      content: fs.readFileSync(fileSplit.slice(1, length).join('/'), 'utf-8'),
      // template: `./${pageHtml}`,
      template: createTemplate(fileSplit.slice(1, length).join('/'), `./${pageHtml}`, index),
      filename: `${fileSplit.slice(3, length).join('/').split('.')[0]}.html`,
      chunks: ['ajs/' + filePath.split('.')[0]]
    })
  })
  return {entry, htmlArr}
// })(glob.sync(resolve(__dirname, '../src/project/*/*.html')))
})(glob('./src/project/*/*.ejs', {sync: true}))

function createTemplate(content, main, index) {
  let strContent = fs.readFileSync(content, 'utf-8')
  let strMain = fs.readFileSync(main, 'utf-8')
  strMain = strMain.replace(/<%= htmlWebpackPlugin.options.content %>/, strContent)
  fs.writeFileSync(path.join(__dirname, `../src/template/template_${index}.ejs`), strMain)
  return path.join(__dirname, `../src/template/template_${index}.ejs`)
}

module.exports = pages;
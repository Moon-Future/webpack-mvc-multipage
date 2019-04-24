const fs = require('fs')
const { resolve } = require('path')
const glob = require('glob')
const rimraf = require('rimraf')

rimraf.sync('../src/template/*', fs, function cb() {
  console.log('template目录已清空')
})

const pages = (entries => {
  let entry = {}, htmlArr = []
  // 格式化生成入口
  entries.forEach((file) => {
    // ...../webpack-mvc/src/page/pageA/index.html
    const fileSplit = file.split('/')
    const length = fileSplit.length
    const filePath = fileSplit.slice(length - 2, length).join('/') // pageA/index.html
    const jsPath = resolve(__dirname, `../src/js/${filePath.split('.')[0]}.js`)
    pageHtml = resolve(__dirname, '../src/_main.ejs')
    if (!fs.existsSync(jsPath)) {
      return;
    }
    entry['js/' + filePath.split('.')[0]] = jsPath
    htmlArr.push({
      title: '标题',
      template: createTemplate(file, pageHtml),
      filename: `${filePath.split('.')[0]}.html`,
      chunks: ['js/' + filePath.split('.')[0]]
    })
  })
  return {entry, htmlArr}
})(glob(resolve(__dirname, '../src/page/*/*.html'), {sync: true}))

function createTemplate(content, main) {
  let strContent = fs.readFileSync(content, 'utf-8')
  let strMain = fs.readFileSync(main, 'utf-8')
  let contentSplit = content.split('/')
  let template = contentSplit.slice(contentSplit.length - 2).join('_').split('.')[0];
  strMain = strMain.replace(/<%= htmlWebpackPlugin.options.content %>/, strContent)
  fs.writeFileSync(resolve(__dirname, `../src/template/template_${template}.ejs`), strMain)
  return resolve(__dirname, `../src/template/template_${template}.ejs`)
}

module.exports = pages;
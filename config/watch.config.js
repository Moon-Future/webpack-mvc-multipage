const fs = require('fs')
const path = require('path')
const watch = require('watch')
const { replaceScript } = require('./page.config.js')

watch.watchTree(path.resolve(__dirname, '../src/page'), (f, curr, prev) => {
  if (typeof f == 'object' && prev === null && curr === null) {
    // Finished walking the tree
  } else if (prev === null) {
    // f is a new file
    createTemplate(f)
  } else if (curr.link === 0) {
    // f was removed
  } else {
    createTemplate(f)
  }
})

function createTemplate(file) {
  if (file.indexOf('.html') === -1) {
    return
  }
  console.log('file', file)
  let mainHtml = path.resolve(__dirname, '../src/_main.ejs')
  let strContent = fs.readFileSync(file, 'utf-8')
  let strMain = fs.readFileSync(mainHtml, 'utf-8')
  let template = file.split('\\').slice(file.split('\\').length - 2).join('_').split('.')[0]
  // 提取页面与主体框架中引入的静态js文件，将其放入入口文件中经行压缩，并适应开发与生产路径
  // 这里不再处理 title 和 静态js 入口压缩
  strMain = replaceScript(strMain, {}, true)
  strContent = replaceScript(strContent, {}, true)
  strContent = strContent.replace(/<%=(.*)%>/, '')
  strMain = strMain.replace(/<%= htmlWebpackPlugin.options.content %>/, strContent)
  fs.writeFileSync(path.resolve(__dirname, `../src/template/template_${template}.ejs`), strMain)
}
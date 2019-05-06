const fs = require('fs')
const path = require('path')
const glob = require('glob')

if (process.env.NODE_ENV === 'development') {
  const rimraf = require('rimraf')
  rimraf.sync(path.resolve(__dirname, '../src/template/*'), fs, function cb() {
    console.log('template目录已清空')
  })
}

const pages = (entries => {
  let entry = {}, htmlArr = []
  // 格式化生成入口
  entries.forEach((file) => {
    // ...../webpack-mvc/src/page/pageA/index.html
    let fileSplit = file.split('/')
    let length = fileSplit.length

    // 页面入口 page/pageA/index.html
    let filePath = fileSplit.slice(length - 3, length).join('/')

    // 根据html路径找到对应的js路径，js可以和html放在同一文件夹，也可单独放在一个文件夹内，只要能找到
    let jsFile = path.resolve(__dirname, `../src/${filePath.split('.')[0]}.js`)
    if (!fs.existsSync(jsFile)) {
      return;
    }
    let jsPath = 'js/' + filePath.split('.')[0]
    entry['js/' + filePath.split('.')[0]] = jsFile
    htmlArr.push(createTemplate({file, jsPath, entry}))
  })
  return {entry, htmlArr}
})(glob(path.resolve(__dirname, '../src/page/*/*.html'), {sync: true}))

function scriptLinkEntry(entry, file) {
  // file: /js/common/js/util.js
  let fileNew = './src/' + file.split('/').slice(2).join('/')
  let fileSplit = fileNew.split('/')
  entry['js/common/' + fileSplit.slice(fileSplit.length - 1).join('/').replace('.js', '')] = fileNew
}

function replaceScript(content, entry, watch = false) {
  let scriptLink = content.match(/<script.*src=["|'](.*)["|']><\/script>/g)
  if (scriptLink) {
    scriptLink.forEach(item => {
      // src: /js/common/js/util.js
      let src = item.match(/src=["|'](.*)["|']/)[1];
      watch ? false : scriptLinkEntry(entry, src)
      let scriptLinkNew = src
      let scriptLinkNewplit = scriptLinkNew.split('/')
      scriptLinkNewplit.splice(3, 1) // ['', 'js', 'common', 'util.js']
      scriptLinkNew = scriptLinkNewplit.join('/')
      // 生产环境根据页面路径找到js的相对路径，开发环境 /js/ 指向 dist 目录下 js 文件夹
      if (process.env.NODE_ENV === 'production') {
        scriptLinkNew = `..${scriptLinkNew}` // ../js/common/util.js
      }
      content = content.replace(src, scriptLinkNew) 
    })
  }
  return content;
}

function createTemplate({file, jsPath, entry}) {
  let obj = {
    title: '',
    template: '',
    filename: '',
    chunks: [jsPath]
  }
  // _main.ejs 页面主题框架，html组件化
  let mainHtml = path.resolve(__dirname, '../src/_main.ejs')
  let fileSplit = file.split('/')
  // html 生成路径
  let filename = fileSplit.slice(fileSplit.length - 2).join('/').split('.')[0];

  let strContent = fs.readFileSync(file, 'utf-8')
  let strMain = fs.readFileSync(mainHtml, 'utf-8')
  let template = fileSplit.slice(fileSplit.length - 2).join('_').split('.')[0]

  // 提取页面title
  let titleMatch = strContent.match(/<%=title(.*)%>/)
  let title = ''
  if (titleMatch) {
    title = titleMatch[1]
    strContent = strContent.replace(/<%=title(.*)%>/, '')
  }

  // 提取页面与主体框架中引入的静态js文件，将其放入入口文件中经行压缩，并适应开发与生产路径
  strMain = replaceScript(strMain, entry)
  strContent = replaceScript(strContent, entry)

  strMain = strMain.replace(/<%= htmlWebpackPlugin.options.content %>/, strContent)
  fs.writeFileSync(path.resolve(__dirname, `../src/template/template_${template}.ejs`), strMain)

  obj.title = title
  obj.template = path.resolve(__dirname, `../src/template/template_${template}.ejs`)
  obj.filename = filename
  return obj
}

pages.replaceScript = replaceScript;

module.exports = pages;
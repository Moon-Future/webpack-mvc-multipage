# webpack-mvc 传统多页面组件化开发

    最近有一个项目，还是使用的传统 MVC 模式开发，完全基于jQuery，使用了基于java模板引擎velocity，页面中嵌入了大量java语法，使得前后端分离不彻底，工程打包上线苦不堪言，为实现后端为服务化，前端也得彻底从后端中分离出来。

# 方案: webpack4 + ejs
## webpack
- 打包所有的 资源
- 打包所以的 脚本
- 打包所以的 图片
- 打包所以的 样式
- 打包所以的 表
## ejs
高效的 JavaScript 模板引擎，代替 velocity

# webpack 配置
## 基本插件
- @babel/core，@babel/preset-env，babel-loader  
  es6 语法转译
- css-loader，style-loader  
  编译打包css
- node-sass，sass-loader  
  解析sass
- postcss-loader，autoprefixer  
  自动给样式增加浏览器前缀
- mini-css-extract-plugin  
  将css从js中抽离出来为单独文件
- optimize-css-assets-webpack-plugin  
  压缩css
- uglifyjs-webpack-plugin  
  压缩js
- ejs-loader  
  解析ejs模板文件
- html-webpack-plugin  
  生成html文件
- rimraf  
  删除文件、文件夹
- watch  
  监听文件变化  

上面是一些要用的插件，具体用法不累述。

## 入口文件
入口文件长这样(可单一入口，也可多入口)：
```js
// 多入口
entry: {
  pageA: './src/pageA/index.js',
  pageB: './src/pageB/index.js',
  'pageC/login': './src/pageC/login/login.js'
}
```
出口文件：
```js
output: {
  filename: '[name].js',
  path: path.resolve(__dirname, '../dist'),
}
```
filename 值中的 [name] 对应入文件的 key 值，/ 分割文件夹。  
最后就会在dist文件夹下生产文件：
- dist/pageA/index.js
- dist/pageB/index.js
- dist/pageC/login/login.js

既然是多页面开发，就要有多个入口，每个页面都要有自己对应的js入口，这样我们只需要遍历html文件，然后找到对应的js，处理成 entry 对象即可
```js
const path = require('path')
const glob = require('glob')

const pages = (entries => {
  let entry = {}, htmlArr = []
  // 格式化生成入口
  entries.forEach((file) => {
    // ...../webpack-mvc/src/page/pageA/index.html
    const fileSplit = file.split('/')
    const length = fileSplit.length

    // 页面入口 pageA/index.html
    const filePath = fileSplit.slice(length - 2, length).join('/') 

    // 根据html路径找到对应的js路径，js可以和html放在同一文件夹，也可单独放在一个文件夹内，只要能找到 
    const jsPath = path.resolve(__dirname, `../src/page/${filePath.split('.')[0]}.js`) 

    // _main.ejs 页面主题框架，html组件化
    pageHtml = path.resolve(__dirname, '../src/_main.ejs') 

    if (!fs.existsSync(jsPath)) {
      return;
    }
    entry['js/' + filePath.split('.')[0]] = jsPath // 加 js/ 即表示将打包后的js单独放在一个文件夹内
  })
  return entry
})(glob(path.resolve(__dirname, '../src/page/*/*.html'), {sync: true}))
```
上面只是本例的目录结构，根据不同的目录结构，更改路径即可，目的就是得到 ‘js打包生成路径’: ‘入口js’ 映射关系。

## html（ejs） 组件化
### 页面框架
#### 1、主体框架 src/_main.ejs
```html
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>

  <body>
    <div class="main-head">
      <%= require('../common/header.ejs')() %>
    </div>

    <div class="main-content">
      <%= htmlWebpackPlugin.options.content %>
    </div>

    <div class="main-foot">
      <%= require('../common/footer.ejs')() %>
    </div>
  </body>

  </html>
```
#### 2、公共页面
header、footer每个页面都包含，所以放入主体框架页面内
#### 3、页面各自部分
各个页面只需要写自己页面的html内容即可，并且还可以引入公共组件ejs
```html
// pageA/index.html
<div>
  <h1>pageA index</h1>
</div>

// pageA/login.html
<div>
  <%= require('../common/table.ejs')() %>
  <h1>pageA login</h1>
</div>
```  
网上查了很多资料，没找到可以实现上面步骤的方法，基本都是要在每个页面的js里去写一些ejs语法，做不到我想要的只关注此页面本身的内容。

### 替换 _main.ejs，生成临时模板
我的解决方法是 通过 node 读取页面 html 文件，然后替换 _main.ejs 中的 content 部分，生成一个临时 ejs 模板文件，然后通过插件 html-webpack-plugin 生成最终页面 html 文件
```js
function createTemplate(file, jsPath, entry) {
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
  let template = fileSplit.slice(fileSplit.length - 2).join('_').split('.')[0];
  strMain = strMain.replace(/<%= htmlWebpackPlugin.options.content %>/, strContent)
  fs.writeFileSync(path.resolve(__dirname, `../src/template/template_${template}.ejs`), strMain)

  obj.template = path.resolve(__dirname, `../src/template/template_${template}.ejs`)
  obj.filename = filename
  return obj
}
```

有了上面方法的思路，我们可以在各自页面中做更多的操作

### 页面 title
```html
// pageA/index.html

<%=title 页面A %>
<div>
  <h1>pageA index</h1>
</div>
``` 
### 页面直接引入js，只压缩不打包
```html
// pageA/index.html

<%=title 页面A %>

<div>
  <h1>pageA index</h1>
</div>

<script src="js/common/util.js"></script>
<script src="js/common/server.api.js"></script>
``` 
这里引入js的路径是最终文件压缩生成的位置（dist目录下），因为开发模式和生产环境路径有所不同，所以等下在代码中要区别不同环境去替换不同的路径。

## page.config.js
```js
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
    htmlArr.push(createTemplate(file, jsPath, entry))
  })
  return {entry, htmlArr}
})(glob(path.resolve(__dirname, '../src/page/*/*.html'), {sync: true}))

function scriptLinkEntry(entry, file) {
  // file: /js/common/js/util.js
  let fileNew = './src/' + file.split('/').slice(2).join('/')
  let fileSplit = fileNew.split('/')
  entry['js/common/' + fileSplit.slice(fileSplit.length - 1).join('/').replace('.js', '')] = fileNew
}

function replaceScript(content, entry) {
  let scriptLink = content.match(/<script.*src=["|'](.*)["|']><\/script>/g)
  if (scriptLink) {
    scriptLink.forEach(item => {
      // src: /js/common/js/util.js
      let src = item.match(/src=["|'](.*)["|']/)[1];
      scriptLinkEntry(entry, src)
      let scriptlinNew = src
      // 生产环境根据页面路径找到js的相对路径，开发环境 /js/ 指向 dist 目录下 js 文件夹
      if (process.env.NODE_ENV === 'production') {
        let srcSplit = src.split('/')
        srcSplit.splice(3, 1) // ['', 'js', 'common', 'util.js']
        scriptLinkNew = `..${srcSplit.join('/')}` // ../js/common/util.js
      }
      content = content.replace(src, scriptLinkNew) 
    })
  }
  return content;
}

function createTemplate(file, jsPath, entry) {
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

module.exports = pages;
```
## 热刷新
此时热刷新只能监听到js和css的改变，因为模板是动态生成的，更改页面内容时模板并没有改变，所以无法触发devServer的热刷新，手动刷新也不会有变化，因为临时模板文件没有改变，借用插件 watch 来监听html文件变化，然后重写模板文件可解决问题。
```js
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
```
这里不再处理title和静态js入口压缩，更改了这些只能再重新 npm run dev
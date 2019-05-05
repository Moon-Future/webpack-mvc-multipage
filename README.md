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
  编译html文件
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
    const filePath = fileSplit.slice(length - 2, length).join('/') // 页面入口 pageA/index.html
    const jsPath = path.resolve(__dirname, `../src/page/${filePath.split('.')[0]}.js`) // 根据html路径找到对应的js路径，js可以和html放在同一文件夹，也可单独放在一个文件夹内，只要能找到 
    pageHtml = path.resolve(__dirname, '../src/_main.ejs') // _main.ejs 页面主题框架，html组件化
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
### 1、主体框架 src/_main.ejs
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
### 2、公共页面
header、footer每个页面都包含，所以放入主体框架页面内
### 3、页面各自部分
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
我的解决方法是 通过 node 读取页面 html 文件，然后替换 _main.ejs 中的 content 部分，生成一个临时 ejs 模板文件，然后 html-webpack-plugin 解析这个文件
```js
// content: 页面文件路径；main: _main.ejs 文件路径
function createTemplate(content, main) {
  let strContent = fs.readFileSync(content, 'utf-8')
  let strMain = fs.readFileSync(main, 'utf-8')
  let contentSplit = content.split('/')
  let template = contentSplit.slice(contentSplit.length - 2).join('_').split('.')[0];
  strMain = strMain.replace(/<%= htmlWebpackPlugin.options.content %>/, strContent)
  fs.writeFileSync(path.resolve(__dirname, `../src/template/template_${template}.ejs`), strMain)
  return path.resolve(__dirname, `../src/template/template_${template}.ejs`)
}
```

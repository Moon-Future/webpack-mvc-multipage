const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

rimraf.sync(path.resolve(__dirname, '../dist/'), fs, function cb() {
  console.log('dist目录已清空')
})
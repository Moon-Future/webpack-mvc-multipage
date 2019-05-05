const fs = require('fs')
const rimraf = require('rimraf')

rimraf.sync('../src/dist', fs, function cb() {
  console.log('dist目录已清空')
})
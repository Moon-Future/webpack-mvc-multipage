const languageProperty = require('../properties/language.properties.js')

function getLanText(val) {
  let lan = 'zh' // $.cookie('lan')
  let str = languageProperty[val] && languageProperty[val][lan] || val
  let defaultOpt = languageProperty[val] && languageProperty[val]['default']
  let opts = defaultOpt && $.extend(true, [], defaultOpt)
  opts ? opts.unshift('') : false
  let args = opts && arguments.length === 1 ? opts : arguments
  if (args.length > 1) {
    let params = Array.property.slice.call(args, 1)
    return str.replace(/{(\d+)}/g, function(curr, index) {
      return params[index]
    })
  } else {
    return str
  }
}

function translateAll() {
  let num = $('html').find('[lang]').length
  let count = 0
  if (num === 0) {
    $('body').show()
  }
  $('html').find('[lang]').each(function() {
    count += 1;
    let lang = $(this).attr('lang')
    if (lang === '') {
      return;
    }
    let nodeName = $(this)[0].nodeName
    let text = getLanText(lang)
    // 简单处理，复杂的可再这里更改
    if (nodeName === 'INPUT') {
      $(this).attr('placeholder', text)
    } else {
      $(this).html(text)
    }
    if (count === num) {
      $('body').show()
    }
  })
}

module.exports = { getLanText, translateAll }
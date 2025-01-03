module.exports = {
  printWidth: 100, //行长度
  tabWidth: 2, //每个缩进空格数
  useTabs: false, //使用制表符
  semi: true, //末尾分号
  vueIndentScriptAndStyle: true, //Vue 文件脚本和样式标签缩进
  quoteProps: 'as-needed', //仅需要时在对象属性周围添加引号
  bracketSpacing: true, //对象内空格{ foo: bar }
  trailingComma: 'all', //多行逗号分隔的句法结构中使用尾随逗号
  bracketSameLine: true, // 多行HTML>放在最后一行末尾
  singleQuote: true, //使用单引号
  jsxBracketSameLine: true, //在 JSX多行HTML>放在最后一行末尾
  jsxSingleQuote: false, //在 JSX 中使用单引号而不是双引号
  arrowParens: 'always', //箭头函数参数周围包含括号
  insertPragma: false, //插入格式标记
  requirePragma: false, //需要格式标记才能格式化
  proseWrap: 'never', //markdown 文本的换行
  htmlWhitespaceSensitivity: 'strict', //HTML 空白敏感性
  endOfLine: 'auto', // 行结束符
  rangeStart: 0, //从指定开始格式化
  singleAttributePerLine: true,
}

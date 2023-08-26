module.exports = {
  '**.{ts,tsx,js,vue}': ['eslint -c .eslintrc.js'],
  '*.scss,*.vue': ['stylelint --config .stylelintrc.json']
}

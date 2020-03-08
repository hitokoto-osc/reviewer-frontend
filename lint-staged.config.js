module.exports = {
  '{components,pages,plugins,layouts,server,store,middleware}/**.{ts,tsx,js,vue}': [
    'eslint -c .eslintrc.js'
  ],
  '*.scss': [
    'stylelint --config .stylelintrc.json'
  ]
}

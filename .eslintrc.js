module.exports = {
  parser: '@typescript-eslint/parser', // 定义eslint解析器
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  // extends: [
  //   'plugin:react/recommended',
  //   'plugin:@typescript-eslint/recommended',
  // ], // 定义文件继承的子规范
  // plugins: ['@typescript-eslint'], // 定义了该eslint文件所依赖的插件
  env: {
    // 制定代码运行环境
    browser: true,
    node: true
  },
  settings: { // 自动发现react的版本，从而进行规范react代码
    "react": {
      "pragma": "React",
      "version": "detect",
    }
  },
  parserOptions: {  // 指定eslint可以解析JSX语法
    "ecmaVersion": 2019,
    "sourceType": 'module',
    "ecmaFeatures": {
      jsx: true
    }
  },
  rules: {

  }
}

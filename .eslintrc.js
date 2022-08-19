// http://eslint.cn/docs/rules/
module.exports = {
//指定代码的运行环境
env: {
browser: true,
node: true,
es6: true,
jest: true,
  },
// 解析器选项
parserOptions: {
// 使用的 ECMAScript 版本
ecmaVersion: 6,
// 代码是 ECMAScript 模块
sourceType: 'module',
// 使用的额外语言特性
ecmaFeatures: {
modules: true,
jsx: true,
    },
/**
     * This setting is required if you want to use rules which require type information
     * https://www.npmjs.com/package/@typescript-eslint/parser
     */
project: './tsconfig.eslint.json',
  },
// 脚本在执行期间访问的额外全局变量
globals: {
require: 'readonly',
egret: 'readonly',
eui: 'readonly',
RES: 'readonly',
dragonBones: 'readonly',
  },
// 指定解析器
parser: '@typescript-eslint/parser',
// 定义ESLint的插件
plugins: ['@typescript-eslint', 'prettier'],
// 继承的规则 [扩展]
extends: [
/**
     * 防止prettier与eslint规则冲突
     */
'prettier',
  ],
// 启用的规则及其各自的错误级别
rules: {
"prettier/prettier": "error",
'@typescript-eslint/explicit-module-boundary-types': 'off',
'@typescript-eslint/promise-function-async': 'off',
'prefer-promise-reject-errors': 'off',
'@typescript-eslint/no-extraneous-class': 'off',
'@typescript-eslint/naming-convention': 'off',
'@typescript-eslint/no-type-alias': 'off',
'max-params': 'warn',
/**
     * 禁止使用未定义变量
     * 不启用。这个对ts支持太差，ts一些声明，也被认为未定义
     */
'no-undef': 'off',
'no-param-reassign': 'off',
'@typescript-eslint/no-unused-vars': 'off',
'no-unused-vars': 'off',
'new-cap': 'off',
'guard-for-in': 'off',
'@typescript-eslint/no-inferrable-types': 'off',
'accessor-pairs': 'off',
'@typescript-eslint/no-unnecessary-type-assertion': 'off',
"complexity": 'warn',
/**
     * 考虑到egret native构建和H5构建, 关闭no-var-requires的检测
     */
// "@typescript-eslint/no-var-requires": 'off',

// "@typescript-eslint/no-this-alias": "off",

/** web-log.ts是用webpack打进html的，没有经过babel，使用展开语法兼容性不好，所以暂时关闭这条 */
"prefer-object-spread": "off",
"@typescript-eslint/ban-ts-comment": "warn",
"quotes": [1, "single"]
  },
};
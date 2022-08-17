const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');  // 静态资源不需要webpack解析，直接在打包的时候把public下的内容复制到构建出口文件夹中
module.exports = merge(baseConfig, {
  mode: 'production', // 生产模式，会开启tree-shaking和压缩代码，以及其他优化
  plugins: [
    // 复制文件插件
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => {
            return !source.includes('index.html') // 忽略index.html
          }
        }
      ]
    })
  ]
})
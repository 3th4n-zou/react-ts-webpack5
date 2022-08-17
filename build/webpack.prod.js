const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');  // 静态资源不需要webpack解析，直接在打包的时候把public下的内容复制到构建出口文件夹中
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const globAll = require('glob-all');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const CompressionPlugin = require('compression-webpack-plugin');

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
    }),
    // 抽离css插件，方便配置缓存策略
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
    // 清理无用的css代码
    new PurgeCssPlugin({
      // 检测src下所有tsx文件和public下index.html中使用的类名和id的标签名称
      // 只打包这些文件中用到的样式
      paths: globAll.sync([
        `${path.join(__dirname, '../src')}/**/*.tsx`,
        path.join(__dirname, '../public/index.html')
      ]),
      // 白名单
      safelist: {
        standard: [/^ant-/],  // 过滤以ant-开头的类名，哪怕没用到也不删除
      }
    }),
    // 打包时生成gzip文件
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css，js压缩文件
      filename: '[path][base].gz',  //  文件命名
      algorithm: 'gzip',  // 压缩格式，默认为gzip
      threshold: 10240, // 只有大小大于这个值的资源会被处理，默认值是 10k
      minRatio: 0.8,  // 压缩率，默认是0.8
    })
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      // 压缩js
      new TerserPlugin({
        parallel: true, //开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log']  // 删除console.log
          }
        }
      })
    ],
    // 分隔代码
    splitChunks: {
      cacheGroups: {
        vendors: {  // 提取 node_modules 代码
          test: /node_modules/,  // 只匹配 node_modules 里面的模块
          name: 'vendors',  // 提取文件命名为vendor，js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial',  // 只提取出实话就能获取到的模块，不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1,  // 提取优先级为1
        },
        commons: {  // 提取页面公共代码
          name: 'commons',  // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
        }
      }
    }
  }
})
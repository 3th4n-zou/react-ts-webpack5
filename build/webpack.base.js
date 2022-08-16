const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack  = require('webpack'); 

module.exports = {
  // 入口文件
  entry: path.join(__dirname, "../src/index.tsx"),
  // 打包文件出口
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"),
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' //打包后文件的公共前缀路径
  },
  module: {
    rules:[
      {
        test: /.(ts|tsx)$/,   // 匹配 .ts .tsx 文件
        use: {
          loader: 'babel-loader',
          options: {
            // 预设从右往左执行
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'], // 这些文件引入可以省略后缀
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),  // 模版取定义root节点的模版
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    })
  ]
};

console.log("NODE_ENV", process.env.NODE_ENV);
console.log("BASE_ENV", process.env.BASE_ENV);

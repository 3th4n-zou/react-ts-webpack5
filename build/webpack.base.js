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
    publicPath: "/", //打包后文件的公共前缀路径
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配 .ts .tsx 文件
        use: "babel-loader",
      },
      // {
      //   // 如果node_modules中有要处理的语法，可以把 js|jsx 配置文件加上
      //   test: /.(js|jsx)$/,
      //   use: 'babel-loader'
      // },
      {
        test: /.(css|scss)$/,
        use: [
          "style-loader",
          "css-loader",
          // {
          //   loader: 'postcss-loader', // 处理css时自动加前缀
          //   options: {
          //     postcssOptions: {
          //       plugins: ['autoprefixer']   // 决定添加哪些前缀到浏览器
          //     }
          //   }
          // },
          "postcss-loader",
          "sass-loader",
        ], // css-loader解析css文件代码；style-loader把解析后的css代码从js抽离，放到头部的style标签中
      },
      // 处理图片
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/images/[name][ext]", // 文件输出目录和命名
        },
      },
      // 处理字体文件
      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/fonts/[name][ext]', // 文件输出目录和命名
        },
      },
      // 处理媒体文件
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/media/[name][ext]', // 文件输出目录和命名
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"], // 这些文件引入可以省略后缀
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), // 模版取定义root节点的模版
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
    }),
  ],
};

console.log("NODE_ENV", process.env.NODE_ENV);
console.log("BASE_ENV", process.env.BASE_ENV);

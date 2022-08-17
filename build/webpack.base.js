const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack  = require('webpack'); 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDEV = process.env.NODE_ENV === 'development';

module.exports = {
  // 入口文件
  entry: path.join(__dirname, "../src/index.tsx"),
  // 打包文件出口
  output: {
    filename: "static/js/[name].[chunkhash:8].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"),
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", //打包后文件的公共前缀路径
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配 .ts .tsx 文件
        include: [path.resolve(__dirname, "../src")], // 只对项目src目录的 ts，tsx 进行 loader 解析
        use: ["thread-loader", "babel-loader"], // 将 thread-loader 放在其他 loader 之前，其他loader会在一个独立的worker池中运行（多进程解析loader）
      },
      /*
      {
        // 如果node_modules中有要处理的语法，可以把 js|jsx 配置文件加上
        test: /.(js|jsx)$/,
        use: 'babel-loader'
      },
      */
      {
        test: /.(css|scss)$/,
        use: [
          isDEV ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-loader，打包模式抽离css（方便配置缓存策略），(配置完成后,在开发模式css会嵌入到style标签里面,方便样式热替换,打包时会把css抽离成单独的css文件)
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ], // css-loader解析css文件代码；style-loader把解析后的css代码从js抽离，放到头部的style标签中
      },
      /*
      {
        test: /.css$/,  // 匹配所有 css 文件 , css 文件不需要使用 sass-loader 解析
        include: [path.resolve(__dirname, '../src')],
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ], // css-loader解析css文件代码；style-loader把解析后的css代码从js抽离，放到头部的style标签中
      },
       {
        test: /.scss$/,  // 匹配所有 scss 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ], // css-loader解析css文件代码；style-loader把解析后的css代码从js抽离，放到头部的style标签中
      },
      */
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
          filename: "static/images/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
      // 处理字体文件
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/fonts/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
      // 处理媒体文件
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/media/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"], // 这些文件引入可以省略后缀
    // 设置别名alias，让后续引用的地方减少路径复杂度
    alias: {
      "@": path.join(__dirname, "../src"),
    },
    modules: [path.resolve(__dirname, "../node_modules")], // 缩小模块搜索范围，查找第三方模块只在本项目的node_modules中查找
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
  cache: {
    type: "filesystem", // 使用文件缓存
  },
};

console.log("NODE_ENV", process.env.NODE_ENV);
console.log("BASE_ENV", process.env.BASE_ENV);

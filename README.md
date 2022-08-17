# command

```
// 打包，打包产物在dist目录下
yarn run build

// 安装serve
npm install --global serve

// 本地开启node服务，运行打包产物
serve -s dist
```

# 配置化境变量

环境变量按作用来分分两种

1. 区分是开发模式还是打包构建模式
2. 区分项目业务环境,开发/测试/预测/正式环境

区分开发模式还是打包构建模式可以用process.env.NODE_ENV,因为很多第三方包里面判断都是采用的这个环境变量。
区分项目接口环境可以自定义一个环境变量process.env.BASE_ENV,设置环境变量可以借助cross-env和webpack.DefinePlugin来设置。

cross-env：兼容各系统的设置环境变量的包
webpack.DefinePlugin：webpack内置的插件,可以为业务代码注入环境变量

```
"scripts": {
    "dev:dev": "cross-env NODE_ENV=development BASE_ENV=development webpack-dev-server -c build/webpack.dev.js",
    "dev:test": "cross-env NODE_ENV=development BASE_ENV=test webpack-dev-server -c build/webpack.dev.js",
    "dev:pre": "cross-env NODE_ENV=development BASE_ENV=pre webpack-dev-server -c build/webpack.dev.js",
    "dev:prod": "cross-env NODE_ENV=development BASE_ENV=production webpack-dev-server -c build/webpack.dev.js",
    
    "build:dev": "cross-env NODE_ENV=production BASE_ENV=development webpack -c build/webpack.prod.js",
    "build:test": "cross-env NODE_ENV=production BASE_ENV=test webpack -c build/webpack.prod.js",
    "build:pre": "cross-env NODE_ENV=production BASE_ENV=pre webpack -c build/webpack.prod.js",
    "build:prod": "cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.prod.js",
  },
```

dev开头是开发模式,build开头是打包模式,冒号后面对应的dev/test/pre/prod是对应的业务环境的开发/测试/预测/正式环境
process.env.NODE_ENV环境变量webpack会自动根据设置的mode字段来给业务代码注入对应的development和prodction,这里在命令中再次设置环境变量NODE_ENV是为了在webpack和babel的配置文件中访问到。

------

# 优化构建速度

* externals: 外包拓展，打包时会忽略配置的依赖，会从上下文中寻找对应变量
* module.noParse: 匹配到设置的模块,将不进行依赖解析，适合jquery,boostrap这类不依赖外部模块的包
* ignorePlugin: 可以使用正则忽略一部分文件，常在使用多语言的包时可以把非中文语言包过滤掉

## devtool

开发过程中或者打包后的代码都是webpack处理后的代码,如果进行调试肯定希望看到源代码,而不是编译后的代码, source map就是用来做源码映射的,不同的映射模式会明显影响到构建和重新构建的速度, devtool选项就是webpack提供的选择源码映射方式的配置。

devtool的命名规则为：

```
^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$
```

| 关键字 | 描述 |
| - | - |
| inline | 代码内通过 dataUrl 形式引入 SourceMap |
| hidden | 生成 SourceMap 文件,但不使用 |
| eval | eval(...) 形式执行代码,通过 dataUrl 形式引入 SourceMap |
| nosources | 不生成 SourceMap |
| cheap | 只需要定位到行信息,不需要列信息 |
| module | 展示源代码中的错误位置 |

### webpack.dev.js

开发环境推荐：`eval-cheap-module-source-map`

* 本地开发首次打包慢点没关系,因为 eval 缓存的原因,  热更新会很快
* 开发中,我们每行代码不会写的太长,只需要定位到行就行,所以加上 cheap
* 我们希望能够找到源代码的错误,而不是打包后的,所以需要加上 module

```
// webpack.dev.js
module.exports = {
  // ...
  devtool: 'eval-cheap-module-source-map'
}
```

### webpack.prod.js

打包环境推荐：none(就是不配置devtool选项了，不是配置devtool: 'none')

* none话调试只能看到编译后的代码,也不会泄露源代码,打包速度也会比较快。
* 只是不方便线上排查问题, 但一般都可以根据报错信息在本地环境很快找出问题所在。

```
// webpack.prod.js
module.exports = {
  // ...
  // devtool: '', // 不用配置devtool此项
}
```

------

# 优化构建结果文件

## 合理配置打包文件hash

* hash：跟整个项目的构建相关,只要项目里有文件更改,整个项目构建的hash值都会更改,并且全部文件都共用相同的hash值
* chunkhash：不同的入口文件进行依赖文件解析、构建对应的chunk,生成对应的哈希值,文件本身修改或者依赖文件修改,chunkhash值会变化
* contenthash：每个文件自己单独的 hash 值,文件的改动只会影响自身的 hash 值

|占位符|解释|
|-|-|
|ext|文件后缀名|
| name | 文件名 |
| path | 文件相对路径 |
| folder | 文件所在文件夹 |
| hash | 每次构建生成的唯一hash值 |
| chunkhash | 根据chunk生成hash值 |
| contenthash | 根据文件内容生成hash值 |

* js我们在生产环境里会把一些公共库和程序入口文件区分开,单独打包构建,采用chunkhash的方式生成哈希值,那么只要我们不改动公共库的代码,就可以保证其哈希值不会受影响,可以继续使用浏览器缓存,所以js适合使用chunkhash
* css和图片资源媒体资源一般都是单独存在的,可以采用contenthash,只有文件本身变化后会生成新hash值

## tree-shaking

* 最早是在rollup库中出现的,webpack在2版本之后也开始支持。webpack模式mode为production时就会默认开启tree-shaking功能以此来标记未引入的js代码然后移除掉。
* css的代码要使用 `purgecss-webpack-plugin` 和 `glob-all` 来进行树摇

## 资源懒加载

* webpack默认支持资源懒加载，只需要引入资源使用 import 语法来引入资源，打包会自动打包为单独的资源文件

## 资源预加载

借助link标签的rel属性prefetch与preload,link标签除了加载css之外也可以加载js资源,设置rel属性可以规定link提前加载资源,但是加载资源后不执行,等用到了再执行。

### rel的属性值

* preload是告诉浏览器页面必定需要的资源,浏览器一定会加载这些资源。
* prefetch是告诉浏览器页面可能需要的资源,浏览器不一定会加载这些资源,会在空闲时加载。

对于当前页面很有必要的资源使用 preload ,对于可能在将来的页面中使用的资源使用 prefetch。

webpack v4.6.0+ 增加了对预获取和预加载的支持,使用方式也比较简单,在import引入动态资源时使用webpack的魔法注释

```
// 单个目标
import(
  /* webpackChunkName: "my-chunk-name" */ // 资源打包后的文件chunkname
  /* webpackPrefetch: true */ // 开启prefetch预获取
  /* webpackPreload: true */ // 开启preload预获取
  './module'
);
```

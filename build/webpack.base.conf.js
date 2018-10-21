'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    //在config - index文件中指定，这个path决定了在build时，输出的文件夹的位置
    path: config.build.assetsRoot,
    filename: '[name].js', //输出打包文件夹的名字
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    extensions: ['.js', '.vue', '.json', '.scss', '.sass'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'src': resolve('src'),
      'static': resolve('static'),
      'node_modules': resolve('node_modules'),
      'views': resolve('src/views'),
      'components': path.resolve(__dirname, '../src/components'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'api': path.resolve(__dirname, '../src/api'),
      'filters': path.resolve(__dirname, '../src/filters'),
      'mixins': path.resolve(__dirname, '../src/mixins'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router'),
      'style': path.resolve(__dirname, '../src/style'),
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

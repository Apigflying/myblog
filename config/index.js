'use strict'
// Template version: 1.2.4 see http://vuejs-templates.github.io/webpack for
// documentation.

const path = require('path')
const devEnv = require('./dev.env')
const prodEnv = require('./prod.env')
/*
  proxyHead: 以 /server 开头的请求，会被代理 http://localhost:9000/server/abc  此链接会被代理
  proxyReal: 目标域 实际开发的域名和端口
  pathRewrite: 是否重写请求。重写规则在下方的pathRewrite中
*/
const serverIp = JSON.parse(prodEnv.BASE_URL)

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    host: JSON.parse(devEnv.HOST),
    port: JSON.parse(devEnv.PORT),
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'eval-source-map',
    cacheBusting: true,
    cssSourceMap: false,
    autoOpenBrowser: true,
    proxyTable: {
      '/user': {
        target: serverIp,
        changeOrigin: true,
      },
      '/create': {
        target: serverIp,
        changeOrigin: true,
      },
      '/getData': {
        target: serverIp,
        changeOrigin: true,
      },
      '/deletes': {
        target: serverIp,
        changeOrigin: true,
      },
    }
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as Surge or Netlify
    // already gzip all static assets for you. Before setting to `true`, make sure
    // to: npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: [
      'js', 'css'
    ],

    // Run the build command with an extra argument to View the bundle analyzer
    // report after build finishes: `npm run build --report` Set to `true` or
    // `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

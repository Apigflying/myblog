'use strict'
const BASE_URL = process.env.NODE_ENV === 'production' ? '"http://myblogs.chenxuanyu.com"' : '"http://localhost:3003"';
module.exports = {
  NODE_ENV: '"production"',
  IS_DEV: 'false',
  BASE_URL: BASE_URL, //服务器地址
  // BASE_URL: '"http://myblogs.chenxuanyu.com"', //服务器地址
}

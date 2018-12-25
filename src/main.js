import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store"; //加载vuex
import "./filters/index.js";
// import 'src/config/rem' //rem布局
import "src/style/cssreset"; //cssreset
import "src/plugins/element.used"; //element按需加载
import "src/style/element.theme"; //设置element的全局样式
import "src/plugins/directive";

import 'font-awesome/css/font-awesome.css'// 字体
import errorImage from '../static/image/error.png'
import loadingImage from '../static/image/loading.svg';
import NProgress from "nprogress"; // progress bar
/* 图片懒加载 */
import VueLazyLoad from 'vue-lazyload';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
Vue.use(mavonEditor)
Vue.use(VueLazyLoad,{
  error:errorImage,
  loading:loadingImage,
})
import moment from 'moment';
Vue.prototype.$moment = moment;
/* 路由鉴权 */
// import "./permission";
/* 模拟数据 */
// import "./mock/index.js";
/* 国际化*/
// import i18n from "./lang";
/* 移动端调出控制台 */
// import VConsole from 'vconsole/dist/vconsole.min.js'
// const vconsole = new VConsole();

Vue.config.productionTip = false;

Vue.prototype.$nprogress = NProgress;

// 会将所有的key以$的形式添加到全局
// 如：$router,$store,$i18n
new Vue({
  router,
  store,
  //i18n,
  render: h => h(App)
}).$mount('#app');

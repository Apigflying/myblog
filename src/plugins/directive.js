import Vue from 'vue';

Vue.directive('bd-click', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el, binding) {
    el.addEventListener('click', function (el) {
      let value = binding.value;
      window._hmt.push(['_trackEvent', ...value])
    })
  }
});



/*
<el-button class="login-btn" type="primary" @click="login" :loading="loading" v-lx-click=“bidxxxx”>登 录</el-button>
Vue.directive('lx-click', {
  inserted: function (el, binding) {
    el.onclick = function (el) {
      let value = binding.value;
      window.LXAnalytics && window.LXAnalytics('moduleClick', value);
    };
  }
});
*/

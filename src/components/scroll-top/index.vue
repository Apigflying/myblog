<template>
<el-collapse-transition>
  <div class="btn-to-top" v-show="isToTopShow" @click="toTop">
    <slot>
      <div class="defalut-btn">
        <i class="fa fa-caret-up"></i>
      </div>
    </slot>
  </div>
  </el-collapse-transition>
</template>

<script>
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
export default {
  name: 'scroll-to-top',
  data () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return {
      htmlEle: document.documentElement,
      scrollTop: scrollTop// 初始展示
    }
  },
  components: {
    "el-collapse-transition": CollapseTransition
  },
  computed: {
    isToTopShow () {
      let scrollTop = this.scrollTop;
      return scrollTop !== 0
    }
  },
  mounted () {
    window.addEventListener('scroll', this.listenScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.listenScroll)
  },
  methods: {
    listenScroll () {
      this.scrollTop = this.htmlEle.scrollTop;
    },
    toTop () {
      let that = this;
      let obj = {};
      let startTime = Date.now();
      let duration = 500;
      let end = 0;
      (function move () {
        obj.move = window.requestAnimationFrame(move, obj);
        let currentVal = that.htmlEle.scrollTop;
        var t = Date.now() - startTime;
        if (t > duration) {
          t = duration;
          window.cancelAnimationFrame(obj.move);
          obj.move = null;
        }
        currentVal = ((end - currentVal) * t / duration) * t / duration + currentVal
        that.htmlEle.scrollTo({
          top: currentVal
        });
        that.scrollTop = currentVal
      })();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/base";
$btnToTop: 36px;
.btn-to-top {
  position: fixed;
  @include wh($btnToTop, $btnToTop);
  border-radius: 50%;
  overflow: s;
  right: $btnToTop;
  bottom: $btnToTop;
  .defalut-btn {
    position: absolute;
    @include wh(100%, 100%);
    line-height: $btnToTop - 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    text-align: center;
    border-radius: 50%;
    @include hover-shadow;
    .fa {
    }
  }
}
</style>

<template>
  <div class="my-blog-wrap">
    <cHeader :title="title" />
    <cNav/>
    <router-view/>
    <cFooter/>
    <scrollTop></scrollTop>
  </div>
</template>

<script>
import cHeader from 'views/my-blog/common/header'
import cFooter from 'views/my-blog/common/footer'
import cNav from 'views/my-blog/common/nav'
import scrollTop from 'components/scroll-top'
export default {
  name: 'diary',
  data () {
    return {
      title:'自由博客'
    }
  },
  components:{
    cHeader,cFooter,cNav,scrollTop
  },
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "../../style/base";
.my-blog-wrap{
  width:1000px;
  margin:0 auto;
}
</style>


<template>
  <div class="article-detail-wrap">
    123
  </div>
</template>
<script>
export default {
  name: 'article-detail',
  data () {
    return {

    }
  },
  created () { },
  mounted () { },
  methods: {
    getDetail (val) {
      console.log(val);
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(from.path);
    let { id } = to.query;
    if(id){
      next(vm => {
        vm.getDetail(id)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/base";
</style>


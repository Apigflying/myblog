<template>
  <div class="message-board-wrap">
    <div v-if="userMessage">
      <router-view></router-view>
    </div>
    <div class="no-user" v-else>
      您需要登录哦
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
  name:'message-board',
  data(){
    return {

    }
  },
  computed: {
    ...mapGetters(['userMessage']),
  },
  created(){},
  mounted(){

  },
  methods:{}
}
</script>
<style lang="scss" scoped>
@import "../../../style/base";

</style>


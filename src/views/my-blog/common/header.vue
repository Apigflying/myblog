<template>
  <header class="header">
    <h1>{{title}}</h1>
    <div class="message-right">
      <div v-if="token" class="message-wrap">
        <span class="user-message" v-if="userMessage">
          Hi，
          <strong>{{userMessage.username}}</strong>
        </span>
        <el-button @click="toRelease">发布文章</el-button>
        <el-button type="primary" @click.native.prevent="handleLogout">
          注销
        </el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click.native.prevent="toLogin">
            登录
        </el-button>
        <el-button @click.native.prevent="toSignUp">
            注册
          </el-button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  name: 'cheader',
  props: ['title'],
  computed: {
    ...mapGetters(['token', 'userMessage'])
  },
  methods: {
    ...mapMutations(['LOGO_OUT']),
    toSignUp () {
      this.$router.push({
        name: 'signUp'
      })
    },
    toLogin () {
      this.$router.push({
        name: 'login'
      })
    },
    toRelease () {
      this.$router.push({
        path: '/release/release-introduction/add'
      })
    },
    handleLogout () {
      this.LOGO_OUT();
      this.$router.push('/login')
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../../style/base.scss";
.header {
  @include wh(100%, 50px);
  @include fj;
  h1{
    font-weight: 100;
  }
  .message-wrap {
    @include fj;
    .user-message {
      display: inline-block;
      margin-right: 10px;
    }
  }
}
</style>

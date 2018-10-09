<template>
  <nav class="nav">
    <router-link v-for="(item,index) in navs" :to="item.path||{name:item.pathName}" :key="index" active-class="nav-active">
      {{item.name}}
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'cnav',
  data: function () {
    return {
      navs: [{
        pathName: 'Home',
        name: '首页'
      }, {
        path: '/my-blog/rank',
        name: '天梯'
      },{
        path: '/my-blog/message-board',
        name: '个人中心'
      }]
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../style/cssreset.scss";
@import "../../../style/base.scss";
.nav {
  @include fj(space-around);
  @include shadow;
  margin-bottom:20px;
  border-radius: 4px;
  background-color: #6cc;
  a {
    @include sc(16px, #fff);
    border-radius: 4px;
    padding: 14px 10px;
    flex: 1;
    margin: 0 4px;
    text-align: center;
    text-decoration:none;
  }
  a:first-of-type {
    margin-left: 0;
  }
  a:last-of-type {
    margin-right: 0;
  }
  .nav-active {
    background: #fd9055;
  }
}
</style>

<template>
<div class="my-blog-wrap">
  <router-view></router-view>
</div>
</template>
<style lang="scss" scoped>
@import "~style/base";
.my-blog-wrap{
  position:absolute;
  top:0;
  bottom:0;
  left:50%;
  transform:translate(-50% ,0);
  padding:0 40px;
  margin:0 auto;
  background:#fff;
  .introduce-wrap{
    width:600px;
  }
  .create-wrap{
    width:1000px;
  }
}
</style>

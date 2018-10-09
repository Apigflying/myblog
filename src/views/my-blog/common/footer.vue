<template>
  <footer class="footer">
    <div class="footer-author">
      <p>
        站长：陈宣宇  -  ICP备案号：黑ICP备17007014号
      </p>
    </div>
  </footer>
</template>

<script>

export default {
  name: 'cfooter',
  data: function () {
    return {
    }
  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">
p{
  margin:0;
}
@import "../../../style/base.scss";
.footer {
  @include fj;
  @include sc(16px, $fff);
  width: 100%;
  padding: 10px 0;
  background: $greencolor;
  border-radius: 4px;
  overflow: hidden;

  margin-bottom: 20px;
  .footer-author {
    margin: auto;
  }
}
</style>

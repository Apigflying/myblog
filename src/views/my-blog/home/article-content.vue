<template>
  <div class="content">
    <div class="artilce-introduce">
      <h2>{{itdc.title}}</h2>
      <div class="itdc-container">
        <div class="item-pic-wrap">
          <img class="item-pic" v-lazy="itdc.imageUrl"/>
        </div>
        <div class="content-wrap">
          <div class="author">
            <span>作者:</span>
            <span>{{itdc.username}}</span>
          </div>
          <div class="create-time">
            <span>发布时间:</span>
            <span>{{itdc.createTime}}</span>
          </div>
          <div>
            <span>分类:</span>
            <span>前端</span>
          </div>
          <p>
            <span>简介:</span>
            <span>{{itdc.introduction}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- <el-button @click="toRelease">去修改</el-button> -->
    <div class="article-content">
      <!-- 文章详细内容 -->
      <mavon-editor v-model="markdown" defaultOpen="preview" :subfield="false" :toolbarsFlag="false"/>
    </div>
    <!-- 评论 -->
    <article-comments :id="id" :itdc="itdc"/>
  </div>
</template>

<script>
import articleContentMixin from 'mixins/articleContent.js';
import ArticleComments from './article-comment.vue';
export default {
  name: 'ArticleContent',
  mixins: [articleContentMixin],
  components: {
    'article-comments':ArticleComments
  },
  methods: {
    toRelease () {
      this.$router.push({
        name: 'ReleaseArticle',
        params: {
          id: this.id
        }
      })
    },
    publish () {
      console.log(escape(this.markdown));
      console.log(unescape(escape(this.markdown)));
    }
  }
}
</script>

<style lang="scss">
@import "../../../style/base.scss";
.content {
  .artilce-introduce {
    .itdc-container {
      display: flex;
      justify-content: space-between;
      .item-pic-wrap {
        .item-pic {
          width: 200px;
        }
      }
      .content-wrap {
        flex: 3;
        margin-left: 10px;
      }
    }
  }
  .article-content {
    margin: 10px 0;
  }
}
</style>

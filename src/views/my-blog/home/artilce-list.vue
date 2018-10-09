<template>
  <main class="main">
    <h3>
      文章推荐
    </h3>
    <ul v-if="articleList.length" class="main-article-wrap" v-loading="isShowLoading">
      <li class="main-article-item" v-for="(item,index) in articleList" :key="index" @click="toDetail(item.id)">
        <!-- <div class="tagboard">
          热
        </div> -->
        <div class="item-pic-wrap">
          <img class="item-pic" v-lazy="item.imageUrl" />
        </div>
        <div class="content-wrap">
          <h4>{{item.title}}</h4>
          <div class="author">
            <div>
              <span>作者:</span>
              <span>{{item.username}}</span>
            </div>
            <div>
              分类:前端
            </div>
            <div>
              <span>发布时间:</span>
              <span>{{item.createTime | time}}</span>
            </div>
          </div>
          <p class="itdc">
            {{item.introduction}}
          </p>
        </div>
      </li>
    </ul>
    <div v-else>您搜索的内容不存在哦~</div>
    <el-pagination v-if="articleList.length" background layout="prev, pager, next" :current-page="current" :page-size="pageSize" :total="total" @current-change="pageChange"/>
  </main>
</template>
<script>
import { getArticleList } from 'api/getData';
import { mapMutations } from 'vuex';
export default {
  name: 'ArticleList',
  data () {
    return {
      current: 1,
      total: 0,
      pageSize: 5,
      isShowLoading: true,
      articleList: [],
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler (to) {
        let { params, query } = to;
        let search = query.search;
        let current = Number(params.page);
        if (current) {
          this.$nextTick(() => {
            this.getArticles(current);
          })
        };
        if (search) {
          this.$nextTick(() => {
            this.getArticles(current, search);
          })
        }
      }
    }
  },
  methods: {
    ...mapMutations(['REMOVE_TOKEN']),
    pageChange (page) {
      this.$router.push({
        name: 'ArticleList',
        params: {
          page
        },
        query: {
          search: this.$route.query.search
        }
      })
    },
    toDetail (id) {
      this.$router.push({
        name: `ArticleContent`,
        params: {
          id
        }
      })
    },
    async getArticles (page, search = '') {
      try {
        let { data: { list, code, len, isTokenCanUse } } = await getArticleList({
          page,
          size: this.pageSize,
          search
        });
        if (code === 200) {
          this.total = len;
          this.current = page;
          this.articleList = list.map(item => {
            return {
              id: item._id,
              username: item.username,
              title: item.title,
              createTime: item.createTime,
              introduction: item.introduction,
              imageUrl: item.imageUrl
            }
          })
          if(!isTokenCanUse){
            this.REMOVE_TOKEN();
          }
        } else {
          this.articleList = [];
        }
      } catch (e) {

      }
      this.isShowLoading = false;
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/cssreset.scss";
@import "../../../style/base";
$tagboardsize: 30px;
$hotcolor: #db4659;
.main {
  .main-article-item {
    @include hover-shadow;
    @include fj;
    position: relative;
    align-items: flex-start;
    background: #fff;
    cursor: pointer;
    padding: 20px 20px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    .tagboard {
      position: absolute;
      @include wh($tagboardsize, $tagboardsize);
      line-height: $tagboardsize;
      text-align: center;
      @include sc(14px, #fff);
      background-color: $hotcolor;
      left: -20px;
      &:after {
        content: "";
        position: absolute;
        @include wh($tagboardsize, $tagboardsize/2);
        left: 0;
        bottom: 0;
        z-index: -1;
        background: linear-gradient(
          left bottom,
          $hotcolor,
          rgba(34, 11, 11, 0.815)
        );
        transform: rotate(30deg);
        transform-origin: 0 $tagboardsize/2;
      }
    }
    .item-pic-wrap {
      flex: 3;
      width: 215px;
      height: 144px;
      margin-right: 20px;
      .item-pic {
        width: 100%;
        height: 100%;
      }
    }
    .content-wrap {
      flex: 6;
      h4 {
        font-size: 18px;
        font-weight: bold;
        padding: 0 0 10px 5px;
        margin: 0;
      }
      .author {
        margin-bottom: 10px;
        margin-left: 10px;
      }
      p {
        text-indent: 2em;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 0;
        margin-top: 5px;
      }
    }
  }
  .main-article-wrap {
    min-height: 800px;
  }
}
</style>



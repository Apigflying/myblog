<template>
  <!-- 用户信息 -->
  <div class="user-message-wrap">
    <div class="user-message">
      <div class="user-pic">
        <img :src="userMessage.picture" />
      </div>
      <div class="user-introduce">
        <div>
          用户名:{{userMessage.username}}
        </div>
        <div>
          个性签名:{{userMessage.individualitySignature}}
        </div>
        <div>
          创建时间:{{$moment(userMessage.createtime).format('YYYY-MM-DD HH:mm:ss')}}
        </div>
        <div>
          用户简介:{{userMessage.introduce}}
        </div>
      </div>
      <div class="to-edit-usermessage">
        <el-button type="primary" @click.native="toEdit">编辑个人信息</el-button>
      </div>
    </div>
    <div class="user-article-list-wrap">
      <div>文章列表</div>
      <ul class="user-article-list" v-if="userArticles.length">
        <li v-for="(item,index) in userArticles" :key="index" class="user-article-item">
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
                <span>{{$moment(item.createtime).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </div>
            </div>
            <p class="itdc">
              {{item.introduction}}
            </p>
          </div>
          <div class="operation">
            <el-button type="primary" round @click.native="editItem(item._id)">编辑</el-button>
            <div></div>
            <el-button type="danger" round @click.native="deleteItem(item._id)">删除</el-button>
          </div>
        </li>
      </ul>
      <div v-else>
        您还没有添加文章，赶快去添加吧~
      </div>
      <!-- <el-pagination v-if="userArticles.length" background layout="prev, pager, next" :current-page="current" :page-size="pageSize" :total="total" @current-change="pageChange"/> -->
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';
import {
  getUserArticles
} from 'api/getData';
import {
  deleteArticleById
} from 'api/deletes';
export default {
  name: 'user-message',
  data () {
    return {
      userArticles: []
    }
  },
  computed: {
    ...mapGetters(['userMessage']),
  },
  async created () {
    await this.getUserMessage();
    await this.getUserArticles();
  },
  methods: {
    ...mapActions(['getUserMessage']),
    toEdit () {
      this.$router.push({
        name: 'EditMessage'
      })
    },
    async getUserArticles () {
      try {
        let {
          data
        } = await getUserArticles();
        if (data.code === 200) {
          this.userArticles = data.data;
        } else {
          this.userArticles = [];
        }
      } catch (e) {
        this.userArticles = [];
      }
    },
    editItem (id) {
      this.$router.push({
        name: 'ReleaseIntroduction',
        params: {
          id
        }
      })
    },
    deleteItem (id) {
      let username = this.userMessage.username;
      this.$confirm('此操作将彻底删除该文章和该文章下的所有评论内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 要验证username
        deleteArticleById({
          username,
          id
        }).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getUserArticles();
          }
        })
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/base";
$tagboardsize: 30px;
$hotcolor: #db4659;
ul {
  list-style: none;
  padding: 0;
}
// 设置图片的
@mixin imgWrap() {
  width: 100px;
  img {
    width: 100%;
  }
}
.user-message-wrap {
  // 用户信息
  .user-message {
    @include fj(flex-start);
    .user-pic {
      @include imgWrap();
    }
  }
  // 用户文章列表
  .user-article-list-wrap {
    .user-article-list {
      // ul
      .user-article-item {
        @include hover-shadow;
        @include fj;
        position: relative;
        align-items: flex-start;
        background: #fff;
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
          width: 150px;
          height: 150px;
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
        .operation {
          flex: 1;
          @include fj;
          flex-direction: column;
        }
      }
    }
  }
}
</style>


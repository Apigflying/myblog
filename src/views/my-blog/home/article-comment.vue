<template>
  <!-- 评论 -->
    <div class="article-comment" v-loading="isUserCommiting">
      <h4>评论</h4>
      <!-- 评论输入框 -->
      <div class="comment-artilce">
        <el-form ref="form" class="clear" :model="form" @submit.native.prevent>
          <el-form-item class="textarea-wrap">
            <el-input v-model="form.comment" ref="maininput" @focus="commentFocus" @blur="commentBlur" class="textarea" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="说说你的看法" resize="none" @keyup.native.ctrl.enter="onComment"></el-input>
          </el-form-item>
          <transition name="el-zoom-in-top">
            <el-form-item label="Ctrl + Enter" class="fr submitBtn">
              <el-button type="primary" @click.native="onComment">评论</el-button>
            </el-form-item>
          </transition>
        </el-form>
      </div>
      <!-- 评论列表 -->
      <ul class="comment-list" v-if="comments.length">
        <li v-for="(item,index) in comments" :key="index" class="item">
          <div class="comment-item">
            <div class="user-pic fl">
              <img :src="item.userPic"/>
            </div>
            <div class="content-box">
              <!-- 评论主体 -->
              <div class="header">
                {{item.userName}} 
                <span class="author" v-show="item.userName === itdc.username">作者</span>
              </div>
              <div class="content">
                <p>
                  {{item.comment}}
                </p>
              </div>
              <!-- 功能 -->
              <div class="footer clear">
                <!-- 赞部分 -->
                <el-button class="like-btn" @click="setPraise(item.id)" :type="item.isUserPraise?'primary':''">
                  <i class="el-icon-caret-top"></i>
                  {{item.praise.length}}
                </el-button>
                <!-- 展示子评论 -->
                <div class="text-pointer" @click="childCommentShow(index)">
                  <i class="fa fa-comment-o" aria-hidden="true"></i>
                  <span v-if="!item.isChildShow">{{item.children.length}}条评论</span>
                  <span v-else>收起评论</span>
                </div>
                <!-- 创建时间 -->
                <div class="date">
                  {{item.createTime | time}}
                </div>
                <!-- 删除 -->
                <el-button v-show="item.isUserCanDelete" @click="deleteComment(item.id)" class="remove-btn">
                  删除
                </el-button>
              </div>
              <!-- 对评论进行评论 -->
              <transition name="el-zoom-in-top">
                <div class="sub-comment-box" v-show="item.isChildShow">
                  <div class="sub-comment-box__inner">
                    <ul class="comment-list sub-comment-list" v-if="item.children.length">
                      <li v-for="(child,indexs) in item.children" :key="indexs" class="item clear">
                        <div class="user-pic fl">
                          <img :src="child.userPic"/>
                        </div>
                        <div class="content-box">
                          <div class="header">
                            {{child.userName}}
                            <span class="author" v-show="child.userName === itdc.username">作者</span>
                          </div>
                          <div class="content">
                            <p>
                              <span v-if="child.replyName">
                                回复<strong class="replyUser">{{child.replyName}}</strong>:
                              </span>
                              {{child.comments}}
                            </p>
                          </div>
                          <div class="footer">
                            <div class="date">
                              {{child.createTime | time}}
                            </div>
                            <div class="text-pointer" @click="childCommentReply(child,index)">
                              回复
                            </div>
                            <el-button class="remove-btn" v-show="child.isUserCanDelete" @click="deleteSubComment(item.id,child.id)">
                              删除
                            </el-button>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="no-comments" v-else>
                      暂无评论，快来抢沙发吧~
                    </div>
                    <el-form class="child-form" :model="item.form" inline @submit.native.prevent>
                      <el-input ref="subinput" class="sub_input" v-model="item.form.comment" :placeholder="item.form.placeHolder"></el-input>
                      <el-form-item>
                        <el-button type="primary" @click="childCommentSubimt(item.id)">
                          {{subFormText(item.form)}}
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="no-comments">
        暂无评论，快来抢沙发吧~
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getArticleCommentById, getSubCommentById } from 'api/getData.js';
import { createArticleComment, setPraise, createSubComment } from 'api/create.js';
import { deleteCommentById, deleteSubComment } from 'api/deletes.js';
export default {
  name: 'ArtilceComment',
  props: ['id','itdc'],
  computed: {
    ...mapGetters(['userMessage','token']),
  },
  watch: {
    async id (val) {
      let { data: { code, comments } } = await getArticleCommentById(this.id);
      if (code === 200) {
        this.comments = this.setComments(comments);
      }
    }
  },
  data () {
    return {
      isUserCommiting: false,
      isSubmitShow: false,
      comments: [],
      form: {
        comment: ''
      }
    }
  },
  methods: {
    // 设置评论 ✔️
    setComments (comments) {
      let user = this.userMessage || {};
      return comments.map((item, index) => {
        // 判断当前用户是否赞过
        let isUserPraise = item.praise.includes(user.username);
        //判断用户是否能删除该评论 (控制删除按钮是否展示)
        let isUserCanDelete = item.userName === user.username;
        return {
          id: item.id,
          userPic: item.userPic,
          userName: item.userName,
          comment: item.comment,
          praise: item.praise,// 点赞数目
          createTime: item.createTime,
          isUserPraise,
          isUserCanDelete,
          isChildShow: this.comments[index] ? this.comments[index].isChildShow : false,// 评论的评论是否展示
          children: item.children,
          form: {
            placeHolder: '输入评论',
            userId: '', // 回复对象的userId 应该是replyId
            userName: '',// 回复谁 这个应该是replyName
            comment: '',// 回复内容
          }
        }
      })
    },
    // 点赞和取消赞 ✔️
    async setPraise (commentId) {
      try {
        let { data: { code, praise, message } } = await setPraise({
          id: this.id,
          commentId
        });
        let user = this.userMessage || {};
        let commentItem = this.comments.find(item => item.id === commentId);
        if (code === 200 && commentItem) {
          commentItem.praise = praise;
          commentItem.isUserPraise = praise.includes(user.username);
        } else {
          this.$message({
            type: 'error',
            message: message
          })
        }
      } catch (e) {

      }
    },
    // 删除子评论
    async deleteSubComment (commentId, childId) {
      try{
        let { data: { code, data, message } } = await deleteSubComment({
          id: this.id, commentId, childId
        })
        if (code === 200) {
          // 数据库中数据已经删除，删除操作，在前端进行
          let commentItem = this.comments.find(item => item.id === commentId);
          let index = commentItem.children.findIndex(item => item.id === childId);
          commentItem.children.splice(index,1);
          this.$message({
            type:'success',
            message
          })
        } else{
          this.$message({
            type:'error',
            message
          })
        }
      }catch(e){
        console.error(e);
      }
    },
    // 删除评论 ✔️
    async deleteComment (commentId) {
      // this.isUserCommiting = true;
      this.$confirm('此操作将删除该评论及对该评论的评论', '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          let { data: { code, message } } = await deleteCommentById({
            id: this.id,
            commentId
          });
          let index = this.comments.findIndex(item => item.id === commentId);
          if (code === 200 && index !== -1) {
            // 删除评论
            this.comments.splice(index, 1);
            this.$message({
              type: 'success',
              message: message
            })
          } else {
            this.$message({
              type: 'error',
              message: message
            })
          }
        } catch (e) {
          console.error(e)
        }
      });
    },
    // 回复 子评论
    childCommentReply ({ userId, userName }, index) {
      this.comments[index].form.userName = userName;
      this.comments[index].form.userId = userId;
      this.comments[index].form.placeHolder = `回复 ${ userName } :`;
      this.subInputFocus(index);
    },
    // 子评论在展示时，自动获取焦点
    subInputFocus (index) {
      this.$nextTick(() => {
        this.$refs.subinput[index].focus();
      });
    },
    // 添加 子评论
    async childCommentSubimt (commentId) {
      let user = this.userMessage || {};
      if (!user) {
        this.$message({
          type: 'warning',
          message: '您需要登录之后才能设置评论呢！'
        })
        return;
      };
      /*
        id - 文章id，通过id获取comments列表
        commentId - 父评论的id
        comments - 子评论的评论内容
        replyUserId - 回复对象的用户id
      */
      try {
        const index = this.comments.findIndex(item => item.id === commentId);
        const { userName, comment, userId } = this.comments[index].form;
        // 清空child-form中的内容到初始状态
        const toRootState = () => {
          this.comments[index].form.userId = '';
          this.comments[index].form.userName = '';
          this.comments[index].form.comment = '';
          this.comments[index].form.placeHolder = '输入评论';
        }
        // 回复人存在，内容为空，那么此时显示'取消'，点击取消重置form内容
        if (!!userId && comment.trim() === '') {
          toRootState();
          this.subInputFocus(index);
          return;
        }
        // 如果内容为空，不能提交
        if (comment.trim() === '') {
          this.$message({
            type: 'warning',
            message: '不能提交空内容哦！'
          })
          return;
        }
        /*
          请求接口，添加数据库
        */
        let { data } = await createSubComment({
          id: this.id,
          commentId,
          comments: this.comments[index].form.comment,
          replyUserId: userId || '',
        });
        /*
          子评论数据格式
            {
              id : 子评论id,
              createTime: 创建时间,
              comments: 评论内容,
              userId: 评论用户的id,
              userName: 评论用户的名字,
              userPic: 评论用户的图片
              ---
              replyUserId: replyUserMes._id,
              replyName: replyUserMes.username,
              replyPic: replyUserMes.picture
            }
        */
        if (data.code === 200) {
          toRootState();
          this.comments[index].children = data.data.map(item => {
            let isUserCanDelete = item.userName === user.username;
            return Object.assign({}, item, {
              isUserCanDelete
            })
          });
          this.$message({
            type: 'success',
            message: data.message
          });
        } else {
          this.$message({
            type: 'warning',
            message: data.message,
            duration: 3000
          });
          // this.$router.push({
          //   name:'login'
          // })
        }
      } catch (e) {

      }
    },
    // 子评论回复按钮的文字 ✔️
    subFormText (form) {
      if (!!form.userName && form.comment === '') {
        return '取消';
      }
      return '评论';
    },
    // 子评论是否展示 ✔️
    async childCommentShow (index) {
      let user = this.userMessage || {};
      // 子评论是否展示
      let isChildShow = this.comments[index].isChildShow;
      this.comments[index].isChildShow = !isChildShow;
      /*
        待办事项：
          加loading
      */
      if (!isChildShow) {
        let { data: children } = await getSubCommentById({
          id: this.id,
          commentId: this.comments[index].id
        });
        if (children.code === 200) {
          this.comments[index].children = children.data.map(item => {
            let isUserCanDelete = item.userName === user.username;
            return Object.assign({}, item, {
              isUserCanDelete
            });
          })
        } else {
          this.comments[index].children = [];
        }
      };
      if (!isChildShow) {
        this.subInputFocus(index);
      }
    },
    commentBlur () {
      this.isSubmitShow = false;
    },
    commentFocus () {
      this.isSubmitShow = true;
    },
    // 提交评论 ✔️
    async onComment () {
      if (!this.form.comment.trim()) {
        this.$message({
          type: 'warning',
          message: '写点什么再提交吧！'
        });
        return;
      }
      this.isUserCommiting = true;
      let user = this.userMessage || {};
      try {
        let { data: { code, data, message } } = await createArticleComment({
          id: this.id,
          comment: this.form.comment
        });

        if (code === 200) {
          let isUserCanDelete = data.userName === user.username;
          this.form.comment = '';
          this.comments.push({
            id: data.id,
            userPic: data.userPic,
            userName: data.userName,
            comment: data.comment,
            praise: [],// 点赞数目
            createTime: data.createTime,
            isUserPraise: false,
            isUserCanDelete,
            isChildShow: false,// 评论的评论是否展示
            children: [],
            form: {
              placeHolder: '输入评论',
              userName: '',// 回复谁
              comment: '',// 回复内容
              createTime: ''// 创建时间
            }
          });
          this.$message({
            type: 'success',
            message: message
          });
        } else if (code === 401) {
          this.$message({
            type: 'warning',
            message: '登录过期了，请重新登录！',
            duration: 3000
          });
          this.$router.push({
            name: 'login'
          })
        } else {
          console.log(123);
          this.$message({
            type: 'warning',
            message,
            duration: 3000
          });
        }
      } catch (e) {

      }
      this.isUserCommiting = false;
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/base.scss";

$userPicWidth: 30px;
.author{
  font-size:12px;
  display:inline-block;
  padding:4px;
  background:red;
  color:white;
  border-radius:4px;
}
.article-comment {
  .comment-artilce {
    .textarea-wrap {
      .textarea:focus ~ .submitBtn {
        display: none;
      }
    }
    .submitBtn {
      width: 160px;
    }
  }
  .comment-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .item {
      padding: 10px 0;
      .user-pic {
        @include wh($userPicWidth);
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .content-box {
        margin-left: $userPicWidth + 5px;
        border-bottom: 1px solid rgba(32, 5, 5, 0.226);
        padding-bottom: 10px;
        .header {
          padding: $userPicWidth/5 0;
        }
        .content {
          margin: 5px 0;
          p {
            margin: 0;
            font-size: 14px;
          }
        }
        .footer {
          $footerHeight: 40px;
          height: $footerHeight;
          margin-bottom: 0px;
          padding-top: 5px;
          position: relative;
          & > * {
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
          }
          .like-btn {
            padding: 5px;
            vertical-align: middle;
          }
          .text-pointer {
            margin: 0 10px;
            cursor: pointer;
          }
          .remove-btn {
            position: absolute;
            right: 0;
            font-size: 12px;
            padding: 5px;
          }
        }
      }
      $borderColor: rgba(247, 95, 236, 0.671);
      .sub-comment-box {
        $arrow-left: 60px;
        border: 1px solid $borderColor;
        border-radius: 3px;
        position: relative;
        &:after {
          content: "";
          position: absolute;
          top: calc(-10px + 2px);
          left: $arrow-left + 1px;
          border-width: 0 8px 8px;
          border-style: solid;
          border-color: transparent transparent #e7e7e7;
        }
        &:before {
          content: "";
          position: absolute;
          left: $arrow-left;
          border-width: 0 9px 10px;
          border-style: solid;
          border-color: transparent transparent $borderColor;
          top: -10px;
        }
      }
    }
  }
  .sub-comment-list {
    padding-left: 10px;
    .content-box {
      margin-right: 20px;
      padding-bottom: 0;
      .footer {
        height: 24px !important;
      }
      .replyUser {
        color: blue;
      }
    }
  }
  .child-form {
    padding-left: $userPicWidth + 10px;
    display: flex;
    justify-content: space-between;
    .sub_input {
      margin-right: 10px;
    }
  }
}
</style>

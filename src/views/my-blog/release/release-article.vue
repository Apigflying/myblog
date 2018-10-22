<template>
<!-- 发布文章 -->
<div class="create-wrap">
  <h3>编写文章</h3>
  <div class="content">
    <div class="edit-area">
      <transition name="el-zoom-in-bottom">
        <div class="tips" v-show="tip">了解markdown语法</div>
      </transition>
      <mavon-editor class="markdown-template" v-model="markdown" placeholder="开始愉快的编写文章内容吧~" :toolbars="toolbars"/>
    </div>
    <div class="operation">
      <el-button @click="submit">发布文章</el-button>
    </div>
  </div>
</div>
</template>
<script>
import articleContentMixin from 'mixins/articleContent.js';
import { createArticleContent } from 'api/create';
export default {
  name: 'ReleaseArticle',
  mixins: [articleContentMixin],
  data () {
    return {
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
      },
      tip:true,
      _timeOut:null
    }
  },
  methods: {
    async submit () {
      if (!this.id) {
        return this.$message({
          type: 'warning',
          message: '没有id，无法创建！'
        })
      }
      let { data } = await createArticleContent({
        id: this.id,
        text: escape(this.markdown),
      })
      if (data.code === 200) {
        this.$message({
          type: 'success',
          message: data.message
        })
        this.$router.push({
          name: 'Home'
        })
      } else {
        this.$message({
          type: 'warning',
          message: data.message
        })
        // this.$router.push({
        //   name:'login'
        // })
      }
    }
  },
  mounted () {
    this._timeOut = setTimeout(() => {
      this.tip = false;
    }, 4000)
  },
  beforeDestroy () {
    clearInterval(this._timeOut);
  }
}
</script>
<style lang="scss">
@import "~style/base";
.v-note-wrapper
  .v-note-panel
  .v-note-navigation-wrapper
  .v-note-navigation-title
  .v-note-navigation-close {
  margin-top: 15px;
}
.create-wrap {
  h3 {
    margin: 0;
    padding: 10px 10px;
    background: $greencolor;
    position: absolute;
    left: 0;
    right: 0;
    color: #f5f5f5;
    border-radius: 0 0 5px 5px;
    overflow: hidden;
  }
  .content {
    padding-top: 60px;
    .edit-area {
      position: relative;
      .tips {
        position: absolute;
        right: -10px;
        top: -42px;
        font-size: 12px;
        background-color: $orangecolor;
        padding: 10px 15px;
        color: #f5f5f5;
        border-radius: 4px;
        z-index: 9999;
        &::before {
          content: "";
          position: absolute;
          right: 20px;
          bottom: -8px;
          z-index: 9998;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 15px 10px 0 10px;
          border-color: $orangecolor transparent transparent transparent;
        }
      }
      .markdown-template {
        min-height: 600px;
      }
    }
    .operation {
      @include fj;
      margin: 10px 0px;
      a {
        text-decoration: none;
      }
    }
  }
}
</style>


<template>
  <!-- 发布简介 -->
  <el-form ref="form" :model="form" class="release-introduction-wrap" @submit.native.prevent>
    <el-form-item label="文章标题">
      <el-input v-model="form.title" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="文章简介">
      <el-input type="textarea" v-model="form.introduction" :rows="2" resize="none" placeholder="请输入文章简介"></el-input>
    </el-form-item>
    <el-form-item label="上传图片">
      <upload-image v-model="imgurls" ref="uploadImage"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :loading="loading">{{createText}}</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import articleContentMixin from 'mixins/articleContent.js';
import { createArticleIntroduce } from 'api/create';
import UploadImage from 'components/upload';
export default {
  // name: 'ReleaseIntroduction',
  mixins: [articleContentMixin],
  components: {
    "upload-image": UploadImage
  },
  data () {
    return {
      uploadImage: null,
      imgurls: [],
      createText: '立即创建',
      loadingEnd: false,
      loading: false,
      form: {
        title: '',// 标题
        introduction: '',// 简介
        imageUrl: ''
      },
    }
  },
  mounted () {
    this.uploadImage = this.$refs.uploadImage;
    this.$nextTick(() => {
      if (this.id && this.id !== 'add') {
        this.createText = '修改简介';
        this.form.title = this.itdc.title;
        this.form.introduction = this.itdc.introduction;
        this.imgurls.push(this.itdc.imageUrl);
      }
    })
  },
  methods: {
    // 创建按钮的事件
    async onSubmit () {
      if (this.loadingEnd) {
        return false;
      }
      if (this.loading) {
        return false;
      }
      this.loading = true;
      if (!this.form.title.trim()) {
        this.loading = false;
        return this.$message({
          type: 'warning',
          message: '文章标题不能为空'
        })
      };
      if (!this.form.introduction.trim()) {
        this.loading = false;
        return this.$message({
          type: 'warning',
          message: '文章简介不能为空'
        })
      };
      try {
        // 此函数执行中会判断，如果没有选择图片，不会提交
        await this.uploadImage.submits();
        if (this.imgurls.length) {
          this.form.imageUrl = this.imgurls[0];
        }
        let ids = this.id === 'add' ? {} : {
          id: this.id
        };
        let { data: { id, code, message } } = await createArticleIntroduce(Object.assign({}, ids, this.form));
        if (code === 200) {
          this.loading = false;
          this.loadingEnd = true;
          this.$router.replace({
            path: `/release/release-article/${ id }`
          })
        } else if (code === 400) {
          this.$message({
            type: 'error',
            message: message
          })
          this.$router.push('/login')
        } else {
          this.$message({
            type: 'error',
            message: message
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/base";
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


<template>
  <div class="introduce-wrap introduce">
    <h3>填写文章简介</h3>
    <!-- 发布简介 -->
    <el-form ref="form" :rules="rules" :model="form" class="release-introduction-wrap" label-width="80px" @submit.native.prevent>
      <el-form-item prop="title" label="文章标题">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="文章分类">
        <el-select v-model="form.type" multiple filterable allow-create default-first-option placeholder="请选择文章分类">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduction" label="文章简介">
        <el-input type="textarea" v-model="form.introduction" :rows="2" resize="none" placeholder="请输入文章简介"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <upload-image v-model="imgurls" ref="uploadImage" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">{{createText}}</el-button>
        <el-button @click.native="turnBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import articleContentMixin from 'mixins/articleContent.js';
import {
  createArticleIntroduce
} from 'api/create';
import UploadImage from 'components/upload';
export default {
  // name: 'ReleaseIntroduction',
  mixins: [articleContentMixin],
  components: {
    "upload-image": UploadImage
  },
  data () {
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入标题'));
      } else {
        callback();
      }
    }
    const validateIntroduce = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入简介'));
      } else {
        callback();
      }
    }
    const validateSelect = (rule, value, callback) => {
      console.log(value);
      if (!value.length) {
        callback(new Error('至少要有一个分类！'));
      } else if (value.length > 4) {
        callback(new Error('最多只能有四个分类！'));
      } else {
        callback();
      }
    }
    return {
      uploadImage: null,
      imgurls: [],
      createText: '立即创建',
      loadingEnd: false,
      loading: false,
      rules: {
        title: [{
          required: true,
          trigger: 'blur',
          validator: validateTitle
        }],
        introduction: [{
          required: true,
          trigger: 'blur',
          validator: validateIntroduce
        }],
        type: [{
          required: true,
          trigger: 'change',
          validator: validateSelect
        }],
      },
      typeOptions: [{
        value: '前端'
      }, {
        value: '后端'
      }, {
        value: '服务器'
      }, {
        value: '日记'
      }],
      form: {
        title: '', // 标题
        introduction: '', // 简介
        imageUrl: '',
        type: ['前端']
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
    turnBack () {
      this.$router.replace('/')
    },
    // 创建按钮的事件
    async onSubmit () {
      if (this.loading) {
        return false;
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            // 此函数执行中会判断，如果没有选择图片，不会提交
            await this.uploadImage.submits();
            if (this.imgurls.length) {
              this.form.imageUrl = this.imgurls[0];
            }
            let ids = this.id === 'add' ? {} : {
              id: this.id
            };
            let {
              data: {
                id,
                code,
                message
              }
            } = await createArticleIntroduce(Object.assign({}, ids, this.form));
            if (code === 200) {
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
            this.loading = false;

          } catch (e) {
            this.$message({
              type: 'error',
              message: e
            })
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      });

    },
  }
}
</script>

<style lang="scss" scoped>
@import "~style/base";
.introduce {
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
  .release-introduction-wrap {
    padding-top: 60px;
  }
}
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
.el-select {
  width: 100%;
}
</style>


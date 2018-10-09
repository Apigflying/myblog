<template>
<!-- 用户编辑自己的信息 -->
  <div class="message-board-wrap">
    <div class="cant-change">
      <!-- 不可修改项 -->
      <div>
        用户名:{{userMessage.username}}
      </div>
    </div>
    <el-form ref="form" :model="form">
      <el-form-item label="个性签名">
        <el-input v-model="form.individualitySignature" placeholder="给自己个个性签名"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="form.introduce" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="介绍一下你自己吧~~" resize="none"></el-input>
      </el-form-item>
      <el-form-item label="上传头像">
        <upload-image v-model="imgurls" ref="uploadImage"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="onSubmit">更新信息</el-button>
        <el-button @click.native="backToUserMessage">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import UploadImage from 'components/upload';
import { updateUserMessage } from 'api/user';
import { mapGetters } from 'vuex';
export default {
  name: 'edit-message',
  data () {
    return {
      uploadImage: null,
      imgurls: [],
      form: {
        individualitySignature: "",
        introduce: "",
        picture: "",
      }
    }
  },
  components: {
    "upload-image": UploadImage
  },
  computed: {
    ...mapGetters(['userMessage']),
  },
  mounted () {
    this.uploadImage = this.$refs.uploadImage;
    if(this.userMessage){
      this.imgurls.push(this.userMessage.picture);
      this.form.individualitySignature = this.userMessage.individualitySignature;
      this.form.introduce = this.userMessage.introduce;
    }
  },
  methods: {
    backToUserMessage () {
      this.$confirm("如果您修改了信息，点”确定“会跳转回之前的页面，并且您修改的信息都不会被保存！", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.toUserMessage();
      });
    },
    toUserMessage () {
      this.$router.push({
        name: 'UserMessage'
      })
    },
    async onSubmit () {
      // 更新用户头像图片
      await this.uploadImage.submits();
      if (this.imgurls.length) {
        this.form.picture = this.imgurls[0];
      };
      let { data } = await updateUserMessage(this.form);
      if (data.code === 200) {
        this.$message({
          type: 'success',
          message: data.message
        });
        this.toUserMessage();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/base";
</style>


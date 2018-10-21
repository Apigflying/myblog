<template>
  <div class="SignUp">
    <el-form class="signUp-form" autoComplete="on" :model="signUp" :rules="loginRules" ref="signUp" label-position="left" @submit.native.prevent>
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>
      <el-form-item prop="username">
        <i class="fa fa-user-o"></i>
        <el-input class="custom-input" name="username" type="text" v-model="signUp.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <i class="fa fa-key"></i>
        <el-input class="custom-input" name="password" :type="passwordType" v-model="signUp.password" autoComplete="on" placeholder="密码" />
        <i class="fa  password" :class="passwordType?'fa-eye':'fa-eye-slash'" @click="changePsType"></i>
      </el-form-item>
      <el-form-item prop="checkPass">
        <i class="fa fa-key"></i>
        <el-input class="custom-input" name="checkPass" :type="passwordType" v-model="signUp.checkPass" autoComplete="on" placeholder="再次输入密码"/>
        <i class="fa password" :class="passwordType?'fa-eye':'fa-eye-slash'" @click="changePsType"></i>
      </el-form-item>
      <el-form-item label="验证码" prop="vaildate">
          <div class="validate-block">
            <el-input v-model="signUp.validate" :maxlength='6' @keyup.enter.native="handleSignUp"></el-input>
          </div>
          <div class="validate-block">
            <img class="validate-code" :src="validateImage" alt="验证码" title="点击更换验证码" @click.prevent="getValidate" />
          </div>
        </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleSignUp">注册</el-button>
    </el-form>
  </div>
</template>

<script>
import { md5 } from 'utils/auth.js';
import { signUp } from 'api/user.js';
import { getValidateCode } from 'api/getData.js';
import loadingSvg from 'static/image/loading.svg';

export default {
  name: 'signUp',
  data () {
    // 用户名验证
    const validateName = (rule, value, callback) => {
      callback();
    }
    // 密码验证
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('输入长度不应小于6位'))
      } else {
        if (this.signUp.checkPass !== '') {
          this.$refs.signUp.validateField('checkPass');
        }
        callback();
      }
    }
    // 再次输入密码
    const validatePassAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.signUp.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    // 验证码
    const validateCode = (rule, value, callback) => {
      // 用户输入的验证码
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (value.length < 6) {
        callback(new Error('验证码输入长度有误'));
      } else {
        callback();
      }
    }
    return {
      validateImage: '',// 图片的base64
      signUp: {
        username: '',
        password: '',
        checkPass: '',
        validate: ''
      },
      loginRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateName
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }],
        checkPass: [{
          required: true,
          trigger: 'blur',
          validator: validatePassAgain
        }],
        validate: [{
          required: true,
          trigger: 'blur',
          validator: validateCode
        }]
      },
      passwordType: 'password',
      loading: false
    }
  },
  created () {
    this.getValidate();
  },
  methods: {
    // 获取 - 刷新验证码图片
    async getValidate () {
      this.validateImage = loadingSvg;
      let {
        data
      } = await getValidateCode();
      this.validateImage = data;
    },
    // 更改输入密码框的类型
    changePsType () {
      this.passwordType = this.passwordType ? '' : 'password'
    },
    signUpSuccess (duration, options) {
      return new Promise((resolve, reject) => {
        const messageInstance = this.$message(options);
        setTimeout(() => {
          resolve(messageInstance.close());
        }, duration)
      })
    },
    // 点击注册
    handleSignUp () {
      this.$refs.signUp.validate(valid => {
        if (valid) {
          this.loading = true;
          this.handlerSignUp({
            username: this.signUp.username,
            password: md5(this.signUp.password),
            validateCode: this.signUp.validate
          }).then(res => {
            this.getValidate();
            let {
              code,
              message
            } = res;
            if (code === 200) {
              // 注册成功
              this.loading = false;
              this.signUpSuccess(2000, {
                type: 'success',
                message
              }).then(r => {
                this.$router.replace({
                  name: 'login'
                })
              });
            } else {
              // 用户名重复
              this.loading = false;
              this.$message({
                type: 'error',
                message
              });
              switch (code) {
                case 405:
                  this.signUp.username = '';
                  this.signUp.validate = '';
                  break;
                case 401:
                  this.signUp.validate = '';
                  break;
              }
            }
          });
        } else {
          console.error('验证错误')
          return false
        }
      })
    },
    async handlerSignUp (request) {
      try {
        let {
          data
        } = await signUp(request);
        return data;
      } catch (e) {
        return e;
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../style/base";
.SignUp {
  @include wh(100%, 100%);
  background: #2d3a4b;
  display: flex;
  .validate-block {
    width: 100px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    height: 40px;
    .el-input__inner {
      padding: 0 15px !important;
    }
    .validate-code {
      width: 100%;
      height: 40px;
      cursor: pointer;
    }
  }
  .signUp-form {
    @include center;
    top: 40%;
    .title {
      text-align: center;
      margin-bottom: 20px;
    }
    .el-form-item {
      position: relative;
      width: 400px;
      margin-bottom: 20px;
      .fa {
        position: absolute;
        color: #889aa4;
        z-index: 2;
        @include center;
        left: 20px;
      }
      .password {
        left: auto;
        right: 10px;
      }
      .el-input {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        .el-input__inner {
          background-color: transparent;
          outline: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0 40px;
        }
      }
    }
  }
}
</style>

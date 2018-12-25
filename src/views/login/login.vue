<template>
  <div class="Login">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form-item prop="username">
        <i class="fa fa-user-o"></i>
        <el-input class="custom-input" :class="warnings.username&&'warning-border'" name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" @focus="onFocus()"/>
      </el-form-item>
      <el-form-item prop="password">
        <i class="fa fa-key"></i>
        <el-input class="custom-input" name="password" :class="warnings.password&&'warning-border'" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" @focus="onFocus()"/>
        <i class="fa  password" :class="passwordType?'fa-eye':'fa-eye-slash'" @click="changePsType"></i>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn login" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button id="signUp" class="btn signUp" :loading="loading" @click.native.prevent="toSignUp" v-bd-click="['sign','click','toSignUp']">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { md5 } from 'utils/auth.js';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'login',
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }]
      },
      passwordType: 'password',
      loading: false,
      warnings:{
        username:false,
        password:false
      }
    }
  },
  computed: { ...mapGetters(['beforeUrl']) },
  methods: {
    ...mapActions(['LoginByUsername','getUserMessage']),
    onFocus(){
      this.warnings.username = this.warnings.password = false;
    },
    toSignUp () {
      this.$router.push({
        name: 'signUp'
      })
    },
    changePsType () {
      this.passwordType = this.passwordType ? '' : 'password'
    },
    async handleLogin () {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try{
            let res = await this.LoginByUsername({
              username: this.loginForm.username,
              password: md5(this.loginForm.password)
            });
            this.loading = false;
            if (res.state === 1) {
              // 跳转到之前页面
              await this.getUserMessage();
              this.$router.replace(this.beforeUrl);
            } else if (res.state === -1) {
              this.$message.error('用户不存在，请您注册!');
              this.warnings.username = true;
            } else if (res.state === 0) {
              this.$message.warning('密码不正确，您再想想~~')
              this.warnings.password = true;
            }
          }catch(e){
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../style/base";
.Login {
  @include wh(100%, 100%);
  background: #2d3a4b;
  display: flex;
  .login-form {
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
    .btn {
      width: 100%;
      margin-bottom: 0px;
    }
  }
}
</style>

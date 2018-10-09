<template>
  <div class="SignUp">
    <el-form class="signUp-form" autoComplete="on" :model="signUp" :rules="loginRules" ref="signUp" label-position="left">
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>
      <el-form-item prop="username">
        <i class="fa fa-user-o"></i>
        <el-input class="custom-input" name="username" type="text" v-model="signUp.username" autoComplete="on" placeholder="用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <i class="fa fa-key"></i>
        <el-input class="custom-input" name="password" :type="passwordType" v-model="signUp.password" autoComplete="on" placeholder="密码" />
        <i class="fa  password" :class="passwordType?'fa-eye':'fa-eye-slash'" @click="changePsType"></i>
      </el-form-item>
       <el-form-item prop="checkPass">
        <i class="fa fa-key"></i>
        <el-input class="custom-input" name="checkPass" :type="passwordType" v-model="signUp.checkPass" autoComplete="on" placeholder="再次输入密码"  @keyup.enter.native="handleSignUp"/>
        <i class="fa password" :class="passwordType?'fa-eye':'fa-eye-slash'" @click="changePsType"></i>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleSignUp">注册</el-button>
    </el-form>
  </div>
</template>
<script>
import {md5} from 'utils/auth.js';
import {signUp} from 'api/user.js'
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
      } else if(value.length<6) {
        callback(new Error('输入长度不应小于6位'))
      } else {
        if (this.signUp.checkPass !== '') {
          this.$refs.signUp.validateField('checkPass');
        }
        callback();
      }
    }
    // 再次输入密码
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.signUp.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      signUp: {
        username: '',
        password: '',
        checkPass:''
      },
      loginRules: {
        username:[{
          required:true,
          trigger:'blur',
          validator:validateName
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }],
        checkPass:[{
          required:true,
          trigger:'blur',
          validator:validatePass2
        }]
      },
      passwordType: 'password',
      loading: false
    }
  },
  methods: {
    // 更改输入密码框的类型
    changePsType(){
      this.passwordType = this.passwordType?'':'password'
    },
    signUpSuccess(duration,options){
      return new Promise((resolve,reject)=>{
        const messageInstance = this.$message(options);
        setTimeout(()=>{
          resolve(messageInstance.close());
        },duration)
      })

    },
    // 点击注册
    handleSignUp () {
      this.$refs.signUp.validate(valid => {
        if (valid) {
          this.loading = true;
          this.handlerSignUp({
            username: this.signUp.username,
            password: md5(this.signUp.password)
          }).then(res=>{
            let {state} = res;
            if(state === 1){
              // 注册成功
              this.loading = false;
              this.signUpSuccess(2000,{
                type:'success',
                message:'创建用户成功！'
              }).then(r =>{
                this.$router.replace({
                  name:'login'
                })
              });
            }else if(state === 2){
              // 用户名重复
              this.loading = false;
              this.$message({
                type:'warning',
                message:'用户名重复，请换一个用户名吧！'
              });
              this.signUp.username = '';
            }
          });
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handlerSignUp(request){
      try{
        let {data} = await signUp(request);
        console.log(data);
        return data;
      }catch(e){
        return e;
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../style/base";
.SignUp {
  @include wh(100%,100%);
  background: #2d3a4b;
  display: flex;
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
      .password{
        left:auto;
        right:10px;
      }
      .el-input {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        .el-input__inner {
          background-color: transparent;
          outline: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding:0 40px;
        }
      }
    }
  }
}
</style>

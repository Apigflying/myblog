webpackJsonp([12],{QUQq:function(n,e,s){"use strict";function t(n){s("Vpq+")}Object.defineProperty(e,"__esModule",{value:!0});var a=s("Xxa5"),r=s.n(a),i=s("exGp"),o=s.n(i),p=s("//Fk"),l=s.n(p),c=s("TIfe"),u=s("vMJZ"),g={name:"signUp",data:function(){var n=this;return{signUp:{username:"",password:"",checkPass:""},loginRules:{username:[{required:!0,trigger:"blur",validator:function(n,e,s){s()}}],password:[{required:!0,trigger:"blur",validator:function(e,s,t){""===s?t(new Error("请输入密码")):s.length<6?t(new Error("输入长度不应小于6位")):(""!==n.signUp.checkPass&&n.$refs.signUp.validateField("checkPass"),t())}}],checkPass:[{required:!0,trigger:"blur",validator:function(e,s,t){""===s?t(new Error("请再次输入密码")):s!==n.signUp.password?t(new Error("两次输入密码不一致!")):t()}}]},passwordType:"password",loading:!1}},methods:{changePsType:function(){this.passwordType=this.passwordType?"":"password"},signUpSuccess:function(n,e){var s=this;return new l.a(function(t,a){var r=s.$message(e);setTimeout(function(){t(r.close())},n)})},handleSignUp:function(){var n=this;this.$refs.signUp.validate(function(e){if(!e)return console.log("error submit!!"),!1;n.loading=!0,n.handlerSignUp({username:n.signUp.username,password:Object(c.b)(n.signUp.password)}).then(function(e){var s=e.state;1===s?(n.loading=!1,n.signUpSuccess(2e3,{type:"success",message:"创建用户成功！"}).then(function(e){n.$router.replace({name:"login"})})):2===s&&(n.loading=!1,n.$message({type:"warning",message:"用户名重复，请换一个用户名吧！"}),n.signUp.username="")})})},handlerSignUp:function(n){var e=this;return o()(r.a.mark(function s(){var t,a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(u.c)(n);case 3:return t=e.sent,a=t.data,console.log(a),e.abrupt("return",a);case 9:return e.prev=9,e.t0=e.catch(0),e.abrupt("return",e.t0);case 12:case"end":return e.stop()}},s,e,[[0,9]])}))()}}},d=function(){var n=this,e=n.$createElement,s=n._self._c||e;return s("div",{staticClass:"SignUp"},[s("el-form",{ref:"signUp",staticClass:"signUp-form",attrs:{autoComplete:"on",model:n.signUp,rules:n.loginRules,"label-position":"left"}},[s("div",{staticClass:"title-container"},[s("h3",{staticClass:"title"},[n._v("注册")])]),n._v(" "),s("el-form-item",{attrs:{prop:"username"}},[s("i",{staticClass:"fa fa-user-o"}),n._v(" "),s("el-input",{staticClass:"custom-input",attrs:{name:"username",type:"text",autoComplete:"on",placeholder:"用户名"},model:{value:n.signUp.username,callback:function(e){n.$set(n.signUp,"username",e)},expression:"signUp.username"}})],1),n._v(" "),s("el-form-item",{attrs:{prop:"password"}},[s("i",{staticClass:"fa fa-key"}),n._v(" "),s("el-input",{staticClass:"custom-input",attrs:{name:"password",type:n.passwordType,autoComplete:"on",placeholder:"密码"},model:{value:n.signUp.password,callback:function(e){n.$set(n.signUp,"password",e)},expression:"signUp.password"}}),n._v(" "),s("i",{staticClass:"fa  password",class:n.passwordType?"fa-eye":"fa-eye-slash",on:{click:n.changePsType}})],1),n._v(" "),s("el-form-item",{attrs:{prop:"checkPass"}},[s("i",{staticClass:"fa fa-key"}),n._v(" "),s("el-input",{staticClass:"custom-input",attrs:{name:"checkPass",type:n.passwordType,autoComplete:"on",placeholder:"再次输入密码"},nativeOn:{keyup:function(e){if(!("button"in e)&&n._k(e.keyCode,"enter",13,e.key))return null;n.handleSignUp(e)}},model:{value:n.signUp.checkPass,callback:function(e){n.$set(n.signUp,"checkPass",e)},expression:"signUp.checkPass"}}),n._v(" "),s("i",{staticClass:"fa password",class:n.passwordType?"fa-eye":"fa-eye-slash",on:{click:n.changePsType}})],1),n._v(" "),s("el-button",{staticStyle:{width:"100%","margin-bottom":"30px"},attrs:{type:"primary",loading:n.loading},nativeOn:{click:function(e){e.preventDefault(),n.handleSignUp(e)}}},[n._v("注册")])],1)],1)},x=[],f={render:d,staticRenderFns:x},m=f,b=s("VU/8"),w=t,h=b(g,m,!1,w,null,null);e.default=h.exports},"Vpq+":function(n,e,s){var t=s("oyj2");"string"==typeof t&&(t=[[n.i,t,""]]),t.locals&&(n.exports=t.locals);s("rjj0")("a4456564",t,!0)},oyj2:function(n,e,s){e=n.exports=s("FZ+f")(!1),e.push([n.i,"\n.warning-border {\n  -webkit-animation: warring 1s infinite;\n          animation: warring 1s infinite;\n}\n@-webkit-keyframes warring {\n0% {\n    -webkit-box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n            box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n}\n50% {\n    -webkit-box-shadow: 0px 0px 0px 0px transparent inset;\n            box-shadow: 0px 0px 0px 0px transparent inset;\n}\n100% {\n    -webkit-box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n            box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n}\n}\n@keyframes warring {\n0% {\n    -webkit-box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n            box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n}\n50% {\n    -webkit-box-shadow: 0px 0px 0px 0px transparent inset;\n            box-shadow: 0px 0px 0px 0px transparent inset;\n}\n100% {\n    -webkit-box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n            box-shadow: 0px 0px 1px 1px rgba(255, 0, 0, 0.7) inset;\n}\n}\n.section {\n  zoom: 1;\n}\n.section:after {\n    content: '';\n    display: block;\n    clear: both;\n}\n.main {\n  float: left;\n  width: 680px;\n}\n.aside {\n  float: right;\n  width: 300px;\n}\n.SignUp {\n  width: 100%;\n  height: 100%;\n  background: #2d3a4b;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.SignUp .signUp-form {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%);\n    top: 40%;\n}\n.SignUp .signUp-form .title {\n      text-align: center;\n      margin-bottom: 20px;\n}\n.SignUp .signUp-form .el-form-item {\n      position: relative;\n      width: 400px;\n      margin-bottom: 20px;\n}\n.SignUp .signUp-form .el-form-item .fa {\n        position: absolute;\n        color: #889aa4;\n        z-index: 2;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        -webkit-transform: translate(-50%, -50%);\n                transform: translate(-50%, -50%);\n        left: 20px;\n}\n.SignUp .signUp-form .el-form-item .password {\n        left: auto;\n        right: 10px;\n}\n.SignUp .signUp-form .el-form-item .el-input {\n        background: rgba(0, 0, 0, 0.1);\n        border-radius: 5px;\n        color: #454545;\n}\n.SignUp .signUp-form .el-form-item .el-input .el-input__inner {\n          background-color: transparent;\n          outline: none;\n          border: 1px solid rgba(255, 255, 255, 0.1);\n          padding: 0 40px;\n}\n",""])}});
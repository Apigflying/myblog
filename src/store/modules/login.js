import { loginByUserName,getUserInfo } from "api/user";
import { setToken,removeToken } from "utils/auth";
import tools from 'utils/tools';
import Cookies from 'js-cookie';

const login = {
  state: {
    token: "",// 用户的身份标识，token
    beforeUrl: '/', // 之前所在的页面
    userAuthList:null, // 权限列表
    userMessage:null // 用户信息
  },
  mutations: {
    SET_TOKEN(state, data) {
      // 拿到token之后，存到cookie中
      state.token = data.token;
      setToken(data.token);
    },
    REMOVE_TOKEN(state) {
      state.token = '';
      tools.setStorage('userMessage','');
      removeToken();
    },
    SET_BEFORE_RUL: (state, beforeUrl) => {
      state.beforeUrl = beforeUrl
      Cookies.set('beforeUrl',beforeUrl)
    },
    LOGO_OUT:(state)=>{
      state.beforeUrl = '/';
      Cookies.set('beforeUrl','/');// 退出登录后，下次登录直接跳转到首页
      // 清除token
      state.token = '';
      removeToken();
      // 清空用户信息
      state.userAuthList = null;
      state.userMessage = null;
      tools.setStorage('userMessage','');
    },
    SET_USER_INFO:(state,data)=>{// 获取用户信息
      state.userMessage = data;
      tools.setStorage('userMessage',data);
    }
  },
  actions: {
     async LoginByUsername({ commit }, userInfo) {
      try {
        // 用户名+密码登录
        let {data} = await loginByUserName(userInfo);
        if(data.state === 1){
          // 用户名密码正确，返回后端返回的数据
          commit("SET_TOKEN", data);
          // await this.getUserMessage();
          return data;
        }else{
          // 密码不对，或者用户不存在
          return data;
        }
      } catch (error) {
        return {
          message:error,
        }
      }
    },
    // 更新用户信息
    async getUserMessage({commit}){
      let {data:userInfos} = await getUserInfo();
      if(userInfos.code===200){
        commit('SET_USER_INFO',userInfos.data);
      }else{
        console.error('vuex store/login.js getUserMessage报错')
      }
    }
  }
};

export default login;

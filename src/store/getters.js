import { getToken } from "utils/auth";
import tools from 'utils/tools';
const getters = {
  token: state => {
    let token = getToken();
    if(state.login.token){
      return state.login.token;
    } else if(token){
      return token;
    }else {
      return '';
    }
  },
  beforeUrl:state=> state.login.beforeUrl,
  userAuthList:state=> state.login.userAuthList,
  userMessage:state=> {
    let userMessage = tools.getStorage('userMessage');
    if(state.login.userMessage){
      return state.login.userMessage
    }else if(userMessage){
      return userMessage;
    }else{
      return '';
    }
  },
  // jobId: state => {
  //   let jobId = state.repair.jobId
  //   if (!jobId) {
  //     jobId = tools.getStorage('jobId')

  //   }
  //   return jobId
  // },
}

export default getters

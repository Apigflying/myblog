import Vue from 'vue';
export default {
  install:function(Vue,opts = {}){
    Vue.prototype.asyncMsg = function(duration, options){
      return new Promise((resolve,reject)=>{
        const messageInstance = Vue.$message(options);
        setTimeout(()=>{
          resolve(messageInstance.close());
        },duration)
      })
    }
  }
}
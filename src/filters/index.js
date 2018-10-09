import Vue from 'vue';
import moment from 'moment';

Vue.filter('time',(value)=>{
  return moment(Number(value)).format('YYYY-MM-DD HH:mm:ss');
});

import { getArticleById } from 'api/getData';
export default {
  data(){
    return {
      itdc:{},
      id:'',
      markdown: ''
    }
  },
  async beforeRouteEnter(to,from,next){
    let { id } = to.params;
    let articleIntroduce,articleContent;
    if(!!id&&id!='add'){
      try{
        let {data} = await getArticleById(id);
        if (!!data.data&&data.code===200) {
          articleIntroduce = data.data.articleIntroduce;
          articleContent = data.data.articleContent;
        }
      }catch(e){

      }
    }
    next(vm => {
      vm.id = id||'';
      if (articleIntroduce) {
        vm.itdc = Object.assign({},articleIntroduce,{
          createTime:vm.$moment(articleIntroduce.createTime).format('YYYY-MM-DD HH:mm:ss')
        });
      }
      if (articleContent) {
        vm.markdown = unescape(articleContent.articleContent);
      }

    })
  },
}

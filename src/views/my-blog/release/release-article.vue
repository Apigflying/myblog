<template>
<!-- 发布文章 -->
<div>
  <mavon-editor v-model="markdown"/>
  <el-button @click="submit">发布文章</el-button>
</div>
</template>
<script>
import articleContentMixin from 'mixins/articleContent.js';

import { createArticleContent } from 'api/create';
export default {
  name: 'ReleaseArticle',
  mixins:[articleContentMixin],
  methods: {
    async submit () {
      if(!this.id){
        return this.$message({
          type:'warning',
          message:'没有id，无法创建！'
        })
      }
      let {data} = await createArticleContent({
        id:this.id,
        text: escape(this.markdown),
      })
      if(data.code === 200){
        this.$message({
          type:'success',
          message:data.message
        })
        this.$router.push({
          name:'Home'
        })
      } else {
        this.$message({
          type:'warning',
          message:data.message
        })
        // this.$router.push({
        //   name:'login'
        // })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/base";

</style>


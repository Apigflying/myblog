<template>
  <div class="upload_block" @click="chooseImage">
    <span class="file_btn">
      <i class="el-icon-plus"></i>
    </span>
    <img v-if="showImg" class="file_img" :src="showImg"/>
    <!-- multiple 属性来添加多张图片 -->
    <input class="file_input" type="file" ref="file_input" @change="fileChange" />
  </div>
</template>
<script>
import { getUploadToken } from 'api/getData';
export default {
  name:'upload',
  model: {
    prop: 'imgurls',
    event: 'sendImg'
  },
  props:['imgurls'],
  data(){
    return {
      fileInput:null,
      sendImgs: [],// 保存图片信息，里面有base64信息
    }
  },
  mounted(){
    this.fileInput = this.$refs.file_input;
  },
  computed:{
    showImg:{
      get(){
        return this.imgurls.length?this.imgurls[0]:'';
      },
      set(val){
        let imgurls = this.imgurls;
        imgurls.splice(0,1,val);
        this.$emit('sendImg',imgurls);
      }
    }
  },
  methods:{
    chooseImage () {
      this.fileInput.click();
    },
    fileChange () {
      let input = this.fileInput;
      let that = this;
      for (var i = 0; i < input.files.length; i++) {
        //input['value']是文件的绝对路径(带后缀名)
        //如果存在,match返回的是一个数组，否则返回的是null
        if (!input['value'].match(/.jpg|.jpeg|.gif|.png|.bmp/i)) {
          return alert("上传的图片格式不正确，请重新选择")
        }
        //全局的构造函数，读取文件的构造函数
        var reader = new FileReader();
        //readAsDataURL()方法，将文件转换成可读的图像文件
        reader.readAsDataURL(input.files[i]);
        reader.onload = function (e) {
          that.showImg = reader.result;
          //reader.result是图像的base64编码
          //可以直接用这个sendImgs中的信息作为img的src来显示图片
          var str = input['value'];
          var re = /\\/g;
          var arrs = str.split(re);
          var filename = arrs[arrs.length - 1];
          that.sendImgs.splice(0,1,{
            filename: filename,
            picBase: this.result
          });
        }
      }
    },
    async submits () {
      if(!this.sendImgs.length){
        return ;
      }
      var imgurls = await this.submitconfig();
      this.$emit('sendImg',imgurls);
    },
    async submitconfig () {
      let { data: { uploadToken: token, urlArea, urlSpace } } = await getUploadToken();
      return await Promise.all(this.sendImgs.map(async (item) => {
        let data = await this.putb64({
          url: urlArea, //七牛云服务器所在的地区。华南：http://upload-z2.qiniu.com
          space: urlSpace, //外链默认域名保存默认域名
          uploadToken: token, //获取到的uploadtoken上传凭证
          picBase: item.picBase //图片的base64编码
        })
        return data;
      }));
    },
    async putb64 (uploads) {
      if (uploads.url == '' || uploads.space == '' || uploads.uploadToken == '' || uploads.picBase == '') {
        alert('有必传项没有填写');
        return '';
      }
      return new Promise((resolve, reject) => {
        try {
          //计算base64文件大小
          let getFileSize = (str) => {
            let indexOf = str.indexOf('=')
            if (indexOf > 0) {
              //如果有=存在，将=过滤掉
              str = str.substring(0, indexOf)
            }
            let fsize = parseInt(str.length - (str.length / 8) * 2)
            return fsize
          }
          uploads.picBase = uploads.picBase.split(',')[1];
          let fsize = getFileSize(uploads.picBase);
          let url = `${ uploads.url }/putb64/${ fsize }`;
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
              let status = xhr.status;
              if (status >= 200 && status < 300) {
                let keyText = eval(`(${ xhr.responseText })`);
                let picUrl = `http://${ uploads.space }/${ keyText.key }`;
                //七牛云返回的图片的url
                resolve(picUrl);
              } else {
                reject(status);
              }
            }
          }
          xhr.open('POST', url, true);
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.setRequestHeader('Authorization', `UpToken ${ uploads.uploadToken }`);
          xhr.send(uploads.picBase);
        } catch (err) {
          reject(err);
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// 上传模块
.upload_block {
  display:inline-block;
  width: 178px;
  height: 178px;
  position: relative;
  // 上传图片按钮
  .file_btn {
    display: flex;
    left:0;right:0;top:0;bottom:0;
    border: 1px dashed #d9d9d9;
    background-color:rgba(190, 190, 190, 0.466);
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    z-index:1;
    transition: 0.3s border-color;
    i {
      transition: 0.3s color;
    }
    &:hover {
      border-color: #409eff;
      i {
        color: #409eff;
      }
    }
  }
  .file_input {
    display: none;
  }
  .file_img {
    width: 100%;
    height:100%;
    position: absolute;
    left:0;right:0;top:0;bottom:0;
    border-radius: 6px;
    overflow: hidden;
  }
}
</style>

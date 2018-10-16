<template>
  <section class="home-wrap">
    <div class="section">
      <router-view></router-view>
    </div>
    <aside class="aside">
      <div clasee="aside-search">
        <h3>站内搜索</h3>
        <div class="search-block">
          <el-input placeholder="请输入内容" v-model="search" class="search">
            <el-button slot="append" icon="el-icon-search" :class="search.length?'search-btn':''" @click="searchList"></el-button>
          </el-input>
        </div>
      </div>
      <div class="follow-me">
        关注我
        <i class="fa fa-github" aria-hidden="true"></i>
      </div>
      <div class="environment" v-if="weather">
        <h3>天气</h3>
        <div>
          <div class="place">
            {{weather.province}} - {{weather.city}}
          </div>
          <div class="weather">
            天气：{{weather.weather}}
          </div>
          <div class="temperature">
            气温：{{weather.temperature}}℃
          </div>
          <div class="humidity">
            湿度：{{weather.humidity}}
          </div>
          <div class="reporttime">
            天气更新时间：{{weather.reporttime}}
          </div>
          <div class="wind">
            风向：{{weather.winddirection}} {{weather.windpower}}级
          </div>
        </div>
      </div>
    </aside>
  </section>
</template>

<script>
import { getUserWeather } from 'api/getData';
export default {
  name: 'Home',
  data () {
    return {
      search: '',
      weather: null
    }
  },
  created(){
    this.getUserWeather();
  },
  methods: {
    async getUserWeather () {
      let { data: { code, data, message } } = await getUserWeather('');
      if (code === 200) {
        this.weather = data;
        console.log(data);
      } else {
        this.weather = null;
        this.$message({
          type: 'warning',
          message,
          center: true,
        })
      }
    },
    toLogin () {
      this.$router.push({
        name: 'login'
      })
    },
    toDetail (id) {
      this.$router.push({
        name: 'ArticleDetail',
        params: { id }
      })
    },
    searchList () {
      let search = this.search;
      if (!search.trim()) {
        return this.$message({
          message: '搜索内容不能为空哦',
          type: 'warning'
        });
      }
      // 提交接口
      this.$router.push({
        name: 'ArticleList',
        query: { search }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../style/base";
$tagboardsize: 30px;
$hotcolor: #db4659;
.home-wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .section {
    flex: 3;
    margin-right: 10px;
  }
  .aside {
    flex: 1;
  }
  h3 {
    @include title-retouch;
    margin-bottom: 20px;
  }
  .aside {
    .search-block {
      padding: 15px 20px;
      background: $fff;
      .search-btn {
        color: $fff;
      }
    }
    .follow-me {
      background: $fff;
      padding: 20px;
      margin: 20px 0;
    }
    .hot-recommend {
      background: $fff;
      .hot-items {
        padding-left: 10px;
        padding-bottom: 10px;
        li {
          height: 40px;
          line-height: 40px;
          i {
            display: inline-block;
            padding: 0 4px;
            font-size: 12px;
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            background-color: #ccc;
          }
          &:nth-of-type(1) {
            i {
              background-color: #ff858e;
            }
          }
          &:nth-of-type(2) {
            i {
              background-color: #77d549;
            }
          }
          &:nth-of-type(3) {
            i {
              background-color: #62c1ff;
            }
          }
        }
      }
    }
    .time-line {
      .time-line-content {
        height: 200px;
      }
    }
  }
}
</style>

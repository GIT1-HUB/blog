<template>
  <div>
    <!-- 收藏 -->
    <div class="favoritecontainer">
      <el-row type="flex" class="row-bg" justify="left">
        <el-col :span="24">
          <nuxt-link
            v-for="item in list"
            :key="item._id"
            target="_blank"
            :to="{path:'/article',query:{id:item._id}}"
            class="box-href"
          >
            <el-card class="box-card" shadow="hover">
              <h2 class="box-title">{{item.title}}</h2>
              <div class="box-icon">
                <span>
                  <i class="el-icon-date"></i>
                  &nbsp;{{item.time}}
                </span>
                <span>
                  <i class="el-icon-view"></i>
                  &nbsp;
                  {{item.readnumber}}次阅读
                </span>
                <span>
                  <i class="el-icon-s-custom"></i>
                  &nbsp;{{item.author}}
                </span>
              </div>
              <div class="box-content">{{item.des}}</div>
            </el-card>
          </nuxt-link>
          <el-pagination
            class="pagination"
            @current-change="pagination"
            background
            layout="prev, pager, next"
            :page-size="5"
            :total="count"
            v-show="count > 5"
          ></el-pagination>
        </el-col>
      </el-row>
      <div v-if="list == ''" class="nolist">
        你还没有收藏文章
        <nuxt-link to="/">去浏览文章</nuxt-link>
      </div>
      <model :model="model" />
    </div>
    <follow-card :username="this.user" />
    <read-card :username="this.user" />
  </div>
</template>
<script>
// 是否登录的组件
import Model from "~/components/Model";
import { baseurl } from "~/plugins/url.js";
import followCard from "~/components/homepage/followcard";
import readCard from "~/components/homepage/readcard";
export default {
  layout: "follow",
  data() {
    return {
      user: this.$route.query.user
        ? this.$route.query.user
        : this.$store.state.username,
      model: false,
      list: [],
      count: 0
    };
  },
  components: {
    Model,
    followCard,
    readCard
  },
  mounted() {
    this.getFavoriteArticle();
  },
  methods: {
    // 收藏的分页
    pagination(page) {
      let json = { page, pagesize: 5, user: this.user };
      this.$axios
        .get(`${baseurl}/article/getFavoriteArticle`, { params: json })
        .then(res => {
          let { error, count, list } = res.data;
          this.list = list;
        })
        .catch(function() {});
    },
    // updateLike() {
    //     console.log(123)
    // },
    // async getLikeArticle() {
    //     let json = {page:1,pagesize:5,user:this.user}
    //     let {status,data:{error,count,list}} = await this.$axios.get('/article/getLikeArticle', { params: json });
    //     this.list = list
    // }
    async getFavoriteArticle() {
      let json = { page: 1, pagesize: 5, user: this.user };
      console.log(this.user);
      let {
        status,
        data: { error, count, list }
      } = await this.$axios.get(`${baseurl}/article/getFavoriteArticle`, {
        params: json
      });
      console.log(list);
      if (status == 200 && error == 0) {
        this.list = list;
        this.count = count;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.favoritecontainer {
  width: 550px;
  // border: 1px solid black;
  position: absolute;
  left: 400px;
  top: 320px;
  .box-card {
    margin-bottom: 20px;
    position: relative;
    .box-title {
      color: #3d5064;
      font-size: 21px;
      text-overflow: ellipsis;
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
    }
    .box-icon {
      color: #999;
      font-size: 12px;
    }
    .box-content {
      color: #666;
      font-size: 14px;
      text-overflow: ellipsis;
      width: 300px;
      overflow: hidden;
      white-space: nowrap;
    }
    .update {
      position: absolute;
      transition: all 1s;
      width: 0;
      height: 110px;
      right: 0;
      bottom: 0;
      // background-color: aqua;
      // color:red;
      font-size: 22px;
      white-space: nowrap;
    }
  }
  .box-card:hover .update {
    width: 100px;
    color: red;
  }
  .nolist {
    margin-left: 120px;
  }
}
</style>

<template>
  <div>
    <!-- 我的主页的首页，显示的是我的文章 -->
    <div class="mycontainer">
      <el-row type="flex" class="row-bg" justify="space-around">
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

              <div class="update">
                <nuxt-link v-if="isself" :to="{path:'/wblog/updateArticle',query:{id:item._id}}">编辑</nuxt-link>
                <div v-else></div>
              </div>
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

      <!-- 如果没有文章显示开始 -->
      <div v-if="list == ''" class="nolist">
        你还没有发表文章
        <nuxt-link to="/wblog/publishArticle">去发表</nuxt-link>
      </div>
      <!-- 显示结束 -->
      <model :model="model" />
    </div>
    <follow-card :username="this.user" />
    <read-card :username="this.user" />
  </div>
</template>
<script>
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
      count: 0,
      isself: true
    };
  },
  components: {
    Model,
    followCard,
    readCard
  },
  mounted() {
    // 挂载时根据作者获取数据
    this.getAllListByAuthor();
    if (this.$route.query.user) {
      this.isself = false;
    } else {
      this.isself = true;
    }
  },
  methods: {
    pagination(page) {
      // 我的文章的分页
      let json = { page, pagesize: 5, author: this.user };
      this.$axios
        .get(`${baseurl}/article/getAllListByAuthor`, { params: json })
        .then(res => {
          let { error, count, list } = res.data;
          this.list = list;
        })
        .catch(function() {});
    },
    async getAllListByAuthor() {
      // 根据作者获取文章的方法
      let json = { page: 1, pagesize: 5, author: this.user };
      let {
        status,
        data: { error, count, list }
      } = await this.$axios.get(`${baseurl}/article/getAllListByAuthor`, {
        params: json
      });
      this.list = list;
      this.count = count;
    }
  },
  // async asyncData(ctx) {
  //   // 初始化，服务端获取数据
  //   let result = await ctx.$axios.get(`${baseurl}/bloguser/getUser`);
  //   let json = { page: 1, pagesize: 5, author: result.data.user };
  //   let {
  //     status,
  //     data: { error, count, list }
  //   } = await ctx.$axios.get(`${baseurl}/article/getAllListByAuthor`, { params: json });
  //   return {
  //     count,
  //     list
  //   };
  // },
  beforeRouteLeave(to, from, next) {
    // 路由拦截，如果没有登录则无法跳转到发布文章页面
    if (to.path == `${baseurl}/wblog/updateArticle`) {
      if (this.$store.state.username == "") {
        return;
      } else {
        next();
      }
    } else {
      next();
    }
    // console.log(to)
    // next()
  }
};
</script>
<style lang="less" scoped>
.mycontainer {
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
      top: 10px;
      right: 0;
      bottom: 0;
      // background-color: aqua;
      // color:red;
      font-size: 22px;
      white-space: nowrap;
    }
  }
  .box-card:hover .update {
    width: 60px;
  }
  .nolist {
    margin-left: 120px;
  }
}
</style>

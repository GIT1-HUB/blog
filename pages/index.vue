<template>
  <div>
    <nav-header :activeIndex="activeIndex"></nav-header>

    <!-- 文章列表 -->
    <el-row type="flex" justify="center" class="content-blog">
      <el-col :span="10" class="content-col">
        <el-tabs class="articlemenu" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="All"></el-tab-pane>
          <el-tab-pane label="前端" name="Front"></el-tab-pane>
          <el-tab-pane label="后端" name="Back"></el-tab-pane>
        </el-tabs>
        <Input
          search
          enter-button="Search"
          placeholder="输入关键词搜索文章"
          @on-search="serachButton"
          @on-change="serachButton"
          v-model="searchInput"
          class="searchInput"
        />

        <nuxt-link
          v-for="item in list"
          :key="item._id"
          target="_blank"
          :to="{path:'/article',query:{id:item._id}}"
          @click.native="clickArticle(item.author,item._id,item.readnumber)"
          class="box-href"
        >
          <el-card class="box-card" shadow="hover">
            <img
              class="bannerimage"
              v-if="item.imgFoleName == '' || item.imgFileName == undefined"
              src="http://pic.soutu123.cn/element_origin_min_pic/01/37/92/40573c69065b76e.jpg%21/fw/700/quality/90/unsharp/true/compress/true"
              alt="没有banner图"
            />
            <img class="bannerimage" v-else :src="curimgurl + item.imgFileName" alt="bannner图" />
            <div class="info">
              <h2 class="box-title">
                {{item.title}}
                <span
                  class="topstatus"
                  v-if="item.topstatus && activeName == 'All'"
                >[置顶]</span>
              </h2>
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
            </div>
          </el-card>
        </nuxt-link>
        <div v-if="list.length == 0">还没有人发表此类文章</div>
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
      <!-- 右侧关于我 -->
      <el-col :span="5" :offset="1">
        <el-card class="about">
          <div class="about-title">about Me</div>
          <div class="about-name">
            <img src="~/static/images/name.png" alt="brianlee" />
          </div>
          <div class="about-content">
            <p>网名：Super li</p>

            <p>职业：Web前端工程师</p>

            <p>邮箱：15528022618@163.com</p>
          </div>
        </el-card>
        <!-- 近期文章开始 -->
        <el-card class="article" v-if="list.length">
          <div class="article-title">近期文章</div>
          <hr />
          <nuxt-link
            v-for="item in lately"
            :key="item._id"
            target="_blank"
            :to="{path:'/article',query:{id:item._id}}"
            class="article-link"
          >
            <i class="el-icon-edit"></i>
            &nbsp;&nbsp;{{item.title}}
          </nuxt-link>
        </el-card>

        <el-card class="article" v-else>
          <div class="article-title">近期文章</div>
          <hr />
          <div>没有文章</div>
        </el-card>
        <!-- 近期文章结束 -->

        <!-- 友情链接开始 -->
        <el-card class="link">
          <div class="link-title">友情链接</div>
          <hr />
          <div class="link-content">
            <a
              v-for="(item,index) in link"
              :href="item.address"
              target="_blank"
              class="link-url"
              :key="index"
            >{{item.name}}</a>
          </div>
        </el-card>
        <!-- 友情链接结束 -->
      </el-col>
    </el-row>
    <div class="beianhao">
      <a href="http://www.beian.miit.gov.cn/" target="_blank">蜀ICP备20010198号</a>
    </div>
  </div>
</template>

<script>
import NavHeader from "~/components/NavHeader";
// baseurl
import { baseurl } from "~/plugins/url.js";
export default {
  name: "index",
  data() {
    return {
      activeIndex: "index",
      activeName: "All",
      searchInput: "",
      link: []
    };
  },
  components: {
    NavHeader
  },
  computed: {
    curimgurl() {
      return `${baseurl}/banner/`;
    }
  },
  mounted() {
    // 设置当前页码为1
    this.page = 1;
    // 根据activeName获取文章
    this.getArticle(this.activeName);
    this.getLink();
    this.adminFeedbackdel();
  },
  methods: {
    // 点击文章的卡片
    clickArticle(author, id, number) {
      if (author == this.$store.state.username) {
        return;
      } else {
        let json = { id: id, number: number + 1 };
        this.$axios.get(`${baseurl}/article/updateReadNumber`, {
          params: json
        });
      }
    },
    async adminFeedbackdel() {
      let username = this.$store.state.username;
      if (username == "") {
        return;
      } else {
        let json = { username: username };
        let {
          status,
          data: { error, result }
        } = await this.$axios.get(`${baseurl}/bloguser/userInfo`, {
          params: json
        });
        if (status == 200 && error == 0) {
          if (result.userInfotext) {
            this.$alert(result.userInfotext, "管理员留言", {
              confirmButtonText: "知道了",
              callback: action => {
                if (action == "confirm") {
                  this.$axios.post(`${baseurl}/bloguser/delAdminMessage`, json);
                } else {
                  return;
                }
              }
            });
          } else {
            return;
          }
        } else {
          return;
        }
      }
    },
    serachButton() {
      // 点击搜索按钮
      if (!this.searchInput) {
        this.getArticle(this.activeName);
        return;
      } else {
        let json = { searcharticle: this.searchInput };
        this.$axios
          .get(`${baseurl}/article/searchArticleList`, { params: json })
          .then(res => {
            let { error, count, list } = res.data;
            this.list = list;
            this.count = count;
          })
          .catch(function() {});
      }
    },

    pagination(page) {
      // 分页方法，点击分页的按钮执行该函数，根据页码更新文章
      let json = { page, pagesize: 5 };
      this.$axios
        .get(`${baseurl}/article/get${this.activeName}Article`, {
          params: json
        })
        .then(res => {
          let { error, count, list } = res.data;
          this.list = list;
        })
        .catch(function() {});
    },

    handleClick(tab, event) {
      //  点击分类，如全部，前端，后端
      // console.log(tab.name);
      // this.activeName = tab.name;
      this.getArticle(tab.name);
    },

    async getArticle(articletype) {
      //根据文章类型获取文章的list
      let json = { page: 1, pagesize: 5 };
      let {
        status,
        data: { count, list }
      } = await this.$axios.get(`${baseurl}/article/get${articletype}Article`, {
        params: json
      });
      let lately = list.slice(0, 4);
      if (status === 200) {
        this.count = count;
        this.list = list;
        this.lately = lately;
      }
    },
    getLink() {
      this.$axios.get(`${baseurl}/adminuser/getLink`).then(data => {
        let {
          status,
          data: { error, link }
        } = data;
        if (status == 200 && error == 0) {
          this.link = link;
        }
      });
    }
  },

  async asyncData(ctx) {
    // 默认初始获取全部文章
    // if (!process.server) return
    let json = { page: 1, pagesize: 5 };
    let {
      status,
      data: { count, list, lately }
    } = await ctx.$axios.get(`${baseurl}/article/getAllArticle`, {
      params: json
    });
    if (status === 200) {
      return {
        count,
        list,
        lately
      };
    }
  },
  head() {
    return {
      title: "李磊的个人博客-一个基于Nuxt构建的博客网站",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "李磊个人博客，关注于web前端技术和web全栈技术的学习研究。"
        },
        {
          hid: "keywords",
          name: "keywords",
          content:
            "李磊,互联网,自媒体,李磊博客,新鲜科技,科技博客，个人博客,原创博客,前端,前端开发,全栈,全栈开发,nuxt,nuxtjs,vue,vuejs"
        },
        { hid: "author", content: "lilei" }
      ]
    };
  }
};
</script>

<style lang="less">
@import "../assets/css/Index/Content.less";

.articlemenu {
  width: 400px;
}
.articleSearch {
  position: absolute;
  top: -10px;
  left: 430px;
}
.searchInput {
  margin-bottom: 20px;
}
.link {
  margin-bottom: 60px;
}
.info {
  float: left;
}
.bannerimage {
  height: 85px;
  width: 100px;
  // display: inline-block;
  float: right;
  margin-right: 150px;
}
.topstatus {
  color: red;
  font-family: "楷体";
  background-color: #fff;
}
.beianhao {
  position: absolute;
  bottom: -340px;
  left: 660px;
}
.beianhao:hover {
  color: #3b8070;
}
</style>

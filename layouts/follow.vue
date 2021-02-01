<template>
  <div>
    <nav-header :activeIndex="activeIndex"></nav-header>

    <el-row type="flex" justify="center" class="content-my">
      <!-- 我的主页导航开始 -->
      <el-col :span="10" class="content-col">
        <keep-alive>
          <el-menu
            :default-active="activeName"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="1">我的文章</el-menu-item>
            <el-menu-item index="2">我的收藏</el-menu-item>
            <el-menu-item index="3">我赞过的</el-menu-item>
            <el-submenu index="4">
              <template slot="title">关注</template>
              <el-menu-item index="4-1">关注者</el-menu-item>
              <el-menu-item index="4-2">关注了</el-menu-item>
            </el-submenu>
          </el-menu>
        </keep-alive>
      </el-col>
      <!-- 我的主页导航结束 -->

      <!-- <el-col :span="4" :offset="1"> -->
      <!-- 我的主页关注模块开始 -->
      <!-- <el-card class="followCard"> -->
      <!-- 个人资料开始 -->
      <!-- <div>
            <el-avatar :size="60" :src="avatarUrl" @error="errorHandler">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
      </div>-->
      <!-- 个人资料结束 -->

      <!-- <span>{{username}}</span>

          <p v-if="userdesc">{{this.userdesc}}</p>
          <p v-else>
            <nuxt-link to="/homepage/set">+ 你的职业是什么</nuxt-link>
          </p>

          <div class="follow">
            <nuxt-link to="/homepage/followers" class="followers">
              <span>关注者</span>
              <span>{{followersNumber}}</span>
            </nuxt-link>
            <el-divider direction="vertical"></el-divider>
            <nuxt-link to="/homepage/followed" class="followed">
              <span>关注了</span>
              <span>{{followedsNumber}}</span>
            </nuxt-link>
          </div>
      </el-card>-->
      <!-- 我的主页关注模块结束 -->
      <!-- </el-col> -->
    </el-row>

    <nuxt />
  </div>
</template>
<script>
import NavHeader from "~/components/NavHeader";
import { baseurl } from "~/plugins/url.js";
export default {
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
  },
  data() {
    return {
      activeIndex: "login",
      activeName: "1",
      username: this.$route.query.user ? this.$route.query.user : this.$store.state.username,
      // isself:true
      // readmore: [],
      // followers: [],
      // followeds: [],
      // avatar:'',
      // userdesc:'',
      // avatarUrl:''
    };
  },
  components: {
    NavHeader
  },
  created() {
    // this.getUserInfo();
  },
  mounted() {
    // this.getReadMore();
    this.getActiveName();
    // this.getFollwPeople();
    // console.log(this.$route.query.user)
    // if(this.$route.query.user) {
    //   this.isself = false
    // } else{
    //   this.isself = true
    // }
  },
  watch: {
    $route: "getActiveName"
  },
  // computed: {
  //   // followersNumber: function() {
  //   //   return this.followers.length;
  //   // },
  //   // followedsNumber: function() {
  //   //   return this.followeds.length;
  //   // },
  //   username() {
  //     return this.$route.query.user || this.$store.state.username
  //   },
  //   // avatarUrl() {
  //   //   return `${baseurl}/uploads/${this.avatar}`
  //   // }
  // },
  methods: {
    // 点击导航跳转到指定页面
    handleSelect(key, keyPath) {
      // console.log(this.$route.query.user,this.username)
      if (this.$route.query.user) {
        var queryuser = this.$route.query.user;
      } else {
        var queryuser = this.$store.state.username;
      }
      if (key == "1") {
        this.$router.push({ path: "/homepage", query: { user: queryuser } });
        // console.log(1);
      } else if (key == "2") {
        this.$router.push({
          path: "/homepage/favorite",
          query: { user: queryuser }
        });
        // console.log(2);
      } else if (key == "3") {
        this.$router.push({
          path: "/homepage/liked",
          query: { user: queryuser }
        });
        // console.log(3);
      } else if (key == "4-1") {
        this.$router.push({
          path: "/homepage/followers",
          query: { user: queryuser }
        });
        // console.log('4-1');
      } else if (key == "4-2") {
        this.$router.push({
          path: "/homepage/followed",
          query: { user: queryuser }
        });
        // console.log('4-2');
      }
    },
    // 根据当前用户获取文章list
    // async getReadMore() {
    //   let json = { page: 1, pagesize: 5, author: this.username };
    //   let {
    //     status,
    //     data: { readmore }
    //   } = await this.$axios.get(`${baseurl}/article/getAllListByAuthor`, {
    //     params: json
    //   });
    //   this.readmore = readmore;
    // },
    // 根据url获取activename
    getActiveName() {
      let path = this.$route.path;
      // console.log(this.username);
      if (path.indexOf("favorite") != -1) {
        this.activeName = "2";
      } else if (path.indexOf("liked") != -1) {
        this.activeName = "3";
      } else if (path.indexOf("followers") != -1) {
        this.activeName = "4-1";
      } else if (path.indexOf("followed") != -1) {
        this.activeName = "4-2";
      } else {
        this.activeName = "1";
      }
    }
    // async getFollwPeople() {
    //   let json = { username: this.username };
    //   let {
    //     status,
    //     data: { error, followers, followeds }
    //   } = await this.$axios.get(`${baseurl}/bloguser/getFollow`, {
    //     params: json
    //   });
    //   if (status == 200 && error == 0) {
    //     this.followers = followers;
    //     this.followeds = followeds;
    //   }
    // },
    // errorHandler() {
    //   return true;
    // },
    // async getUserInfo() {
    //   let json = {username:this.username}
    //   let {status,data:{error,result}} = await this.$axios.get(`${baseurl}/bloguser/userInfo`,{
    //     params:json
    //   })
    //   //  avatar = result.avatar;
    //   // this.userdesc = result.userdesc;
    //   console.log(result.avatar)
    //   // console.log(this.username)
    //   if(status == 200 && error == 0) {
    //     this.avatar = result.avatar;
    //     this.userdesc = result.userdesc;
    //     // this.avatarUrl = `${baseurl}/uploads/${this.avatar}`;
    //   }
    // }
  }
};
</script>
<style lang="less">
@globalColor: #41b883;
@color: #3d5064;
.el-menu-demo {
  width: 400px;
}
.followCard {
  font-size: 16px;
  min-width: 250px !important;
  margin: 30px auto;
  text-align: center;
  span {
    font-size: 18px;
  }
  .follow {
    display: flex;
    justify-content: center;
    align-items: center;
    .followers {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding: 10px;
    }
    .followed {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      align-items: center;
    }
  }
}
.content-my {
  min-width: 100%;
}
.content-col {
  height: 100px;
}
/*右侧排行榜文章*/
.readCard {
  margin-top: 1.5rem;
  width: 253px;
  text-align: center;
  min-width: 220px !important;
  .read-title {
    background-color: #169fe6;
    color: white;
    width: 210px;
    line-height: 45px;
  }
  ul li {
    list-style: none;
    border: 1px solid lightblue;
  }
  ul li:hover {
    background-color: rgb(233, 233, 233);
  }
  .read-link {
    text-decoration: none;

    display: block;
    padding: 0.5rem 0;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    &:hover {
      transition: all ease 0.7s;
      color: @globalColor;
    }
  }
}
</style>
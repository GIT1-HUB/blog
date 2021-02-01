<template>
  <div>
    <div class="nav">
      <el-row type="flex" class="NavHeader" justify="center">
        <!-- 头部左边标题开始 -->
        <el-col :span="12">
          <nuxt-link to="/" class="logo">LiLei's Blog</nuxt-link>
        </el-col>
        <!-- 头部左边标题结束 -->

        <!-- 头部右边导航开始 -->
        <el-col :span="8">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo navbar"
            mode="horizontal"
            text-color="#fff"
            @select="handleSelect"
            active-text-color="#41b883"
          >
            <!--<el-menu-item index="1">处理中心</el-menu-item>-->
            <el-menu-item index="index">文章列表</el-menu-item>
            <!--<el-menu-item index="Backarticle">后端文章</el-menu-item>-->
            <el-menu-item index="wblog">写博客</el-menu-item>
            <!--<el-menu-item index=""><a href="http://docs.brianlee.cn" class="docs" target="_blank">文档中心</a></el-menu-item>-->
            <el-menu-item index="about">关于我</el-menu-item>
            <el-submenu index="login" class="username" v-if="isLogin">
              <template class="1234" slot="title">{{this.$store.state.username}}</template>
              <el-menu-item index="/homepage" class="userindex">
                <nuxt-link to="/homepage">
                  <span class="iconfont1">&#xe663;</span>
                  <span>我的主页</span>
                </nuxt-link>
              </el-menu-item>
              <el-menu-item index="/homepage/liked" class="userindex">
                <nuxt-link to="/homepage/liked">
                  <span class="iconfont1">&#xe60c;</span>
                  <span>我赞过的</span>
                </nuxt-link>
              </el-menu-item>
              <el-menu-item index="/homepage/favorite" class="userindex">
                <nuxt-link to="/homepage/favorite">
                  <span class="iconfont1">&#xe687;</span>
                  <span>我的收藏</span>
                </nuxt-link>
              </el-menu-item>
              <el-menu-item index="/resetpassword/set" class="userindex">
                <nuxt-link to="/resetpassword/set">
                  <span class="iconfont1">&#xe611;</span>
                  <span>&nbsp;&nbsp;设&nbsp;&nbsp;置&nbsp;</span>
                </nuxt-link>
              </el-menu-item>
              <el-menu-item index="/exit" class="userindex">
                <nuxt-link to="/exit">
                  <span class="iconfont1">&#xe797;</span>
                  <span>&nbsp;&nbsp;退&nbsp;&nbsp;出&nbsp;</span>
                </nuxt-link>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="login" class="username" v-else>
              <template class="1234" slot="title">登录/注册</template>
              <span class="nologin">你还没有登录</span>
              <el-button type="primary" round class="nologinButton" @click="goLogin">去登录</el-button>
            </el-submenu>
            <!-- <el-menu-item index="login" class="user" @mouseenter.native="isShow = true">{{username}}</el-menu-item> -->

            <!-- 头部下拉菜单开始 -->
            <!-- <transition name="fade">
              <div
                class="usercard"
                v-if="isShow"
                @mouseleave="isShow = false"
                @mouseenter="isShow = true"
              >
                <ul v-if="isLogin">
                  <li>
                    <nuxt-link to="/homepage" target="_blank">
                      <i class="el-icon-user-solid"></i>
                      <span>我的主页</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/homepage/liked" target="_blank">
                      <img
                        src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg"
                        class="mystar"
                      />
                      <span>我赞过的</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/homepage/favorite" target="_blank">
                      <i class="el-icon-star-on"></i>
                      <span>我的收藏</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to target="_blank">
                      <i class="el-icon-s-tools"></i>
                      <span>&nbsp;&nbsp;设&nbsp;&nbsp;置&nbsp;</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/exit">
                      <Icon type="md-exit" />
                      <span>&nbsp;&nbsp;退&nbsp;&nbsp;出&nbsp;</span>
                    </nuxt-link>
                  </li>
                </ul>
                <div v-else>
                  <span class="nologin">你还没有登录</span>
                  <el-button type="primary" round class="nologinButton" @click="goLogin">去登录</el-button>
                </div>
              </div>
            </transition>-->
            <!-- 头部下拉菜单结束 -->
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <!-- 头部左边标题结束 -->
    <img src="~/static/images/banner.jpg" alt="banner" class="banner_img" />
    <Modal
      v-model="modal1"
      title="登录提示"
      ok-text="去登录"
      cancel-text="取消"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <p>你还没有登录，去登陆</p>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modal1: false,
      isShow: false,
      username: "登录/注册",
      isLogin: false
    };
  },
  props: {
    // 传入activeIndex，确定active的导航
    activeIndex: {
      type: String,
      default: "index"
    }
  },
  methods: {
    // over() {
    //   this.isShow = true;
    // },
    // out() {
    //   let self = this;
    //   self.timer = window.setTimeout(function() {
    //     self.isShow = false;
    //   }, 150);
    //   console.log(self._timer);
    // },
    // cardOver() {
    //   window.clearTimeout(this.timer);
    //   // this.isShow = true;
    //   // console.log(123)
    //   console.log(this._timer);
    // },
    // cardOut() {
    //   this.isShow = false;
    // },

    // 点击导航跳转到指定页面
    handleSelect(key, keyPath) {
      
      if (key == "wblog") {
        // console.log(1111)
        if (this.username == "登录/注册") {
          this.modal1 = true;
          return;
        } else {
          this.$router.push({ path: '/wblog' });
        }
      } else if(key == "index") {
        this.$router.push({ path: '/' });
      } else if(key == "about") {
        this.$router.push({ path: '/about' });
      } else {
        // console.log(key)
        this.$router.push({ path: key });
      }

      
    },

    // 登录model关闭打开
    ok() {
      this.modal1 = false;
      this.$router.push("/login");
    },
    cancel() {
      this.modal1 = false;
      return;
    },

    // 设置当前username
    setUser() {
      let user = this.$store.state.username;
      if (user == "") {
        this.isLogin = false;
        this.username = "登录/注册";
      } else {
        this.username = user;
        this.isLogin = true;
      }
    },

    // 跳转到登录页面
    goLogin() {
      this.$router.push("/login");
    }
  },
  mounted() {
    this.setUser();
  }
};
</script>
<style lang="less">
@import "./../assets/css/Index/NavHeader.less";

.usercard {
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  transition: all 0.5s ease;
  text-align: center;
  top: 60px;
  right: 50px;
  display: block;
  // height: 190px;
  // margin: 0;
  // padding: 0;
  width: 100px;
  ul {
    width: 100px;
    height: 190px;
    display: flex;
    flex-direction: column;
    li {
      list-style: none;
      width: 100px;
      color: #71777c !important;
      font-size: 14px !important;
      height: 38px;
      a {
        color: #71777c !important;
        // display: block;
        padding: 6px 6px;
        height: 38px;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      a:hover {
        background-color: rgb(221, 216, 216);
      }
    }
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter, .fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.nologin {
  display: block;
  text-align: center;
  color: red;
  margin-top: 10px;
}

.nologinButton {
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
</style>

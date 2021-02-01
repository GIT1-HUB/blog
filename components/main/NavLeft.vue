<template>
  <!-- 后台左侧菜单 -->
  <Menu
    :active-name="isActive"
    :open-names="['1','2']"
    class="menu-left"
    @on-select="getIndex"
    style="width:100%;min-height:100vh;min-width:160px"
  >
    <Submenu name="1">
      <template slot="title">
        <Icon class="iconfont" type="ios-construct" />控制面板
      </template>
      <MenuItem name="welcome">
        <Icon type="ios-happy-outline" class="iconfont" />welcome
      </MenuItem>
      <MenuItem name="articleList">
        <Icon class="iconfont" type="md-list" />文章列表
      </MenuItem>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon class="iconfont" type="ios-chatbubbles-outline" />评论管理
      </template>
      <MenuItem name="comment">
        <Icon class="iconfont" type="logo-freebsd-devil" />评论列表
      </MenuItem>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon class="iconfont" type="ios-mail-outline" />留言管理
      </template>
      <MenuItem name="feedback">
        <Icon class="iconfont" type="ios-mail-open-outline" />留言列表
      </MenuItem>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <Icon class="iconfont" type="ios-link" />友情链接管理
      </template>
      <MenuItem name="links">
        <Icon class="iconfont" type="ios-link-outline" />友情链接列表
      </MenuItem>
    </Submenu>
    <Submenu name="5">
      <template slot="title">
        <Icon class="iconfont" type="ios-people-outline" />用户管理
      </template>
      <MenuItem name="user">
        <Icon class="iconfont" type="ios-person-outline" />用户管理列表
      </MenuItem>
    </Submenu>
  </Menu>
</template>
<script>
export default {
  data() {
    return {
      isActive: ""
    };
  },
  mounted() {
    // 获取当前active
    this.getActive();
    // console.log(111)
  },
  watch: {
    // 监听路由变化，执行getactive函数
    $route: "getActive"
  },
  methods: {
    // 点击导航跳转指定页面
    getIndex(val) {
      this.isActive = val;
      if (val == "welcome") {
        this.$router.push("/main/admin");
      } else {
        this.$router.push("/main/" + val);
      }
    },
    // 根据路由获取active
    getActive() {
      let path = this.$route.path;
      // console.log(path);
      if (path.indexOf("List") !== -1) {
        this.isActive = "articleList";
      } else if (path.indexOf("comment") !== -1) {
        this.isActive = "comment";
      } else if (path.indexOf("feedback") !== -1) {
        this.isActive = "feedback";
      } else if (path.indexOf("links") !== -1) {
        this.isActive = "links";
      } else if (path.indexOf("user") !== -1) {
        this.isActive = "user";
      } else {
        this.isActive = "welcome";
      }
    }
  }
};
</script>
<style lang="less">
.ivu-menu-item {
  font-weight: bold !important;
  i {
    font-weight: bold;
    font-size: 14px;
  }
}
.iconfont {
  font-weight: bold;
  font-size: 14px;
}
</style>
